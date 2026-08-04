// app/api/feedback/route.ts
import {NextRequest, NextResponse} from "next/server";
import {
    buildFeedbackTelegramMessage,
    getFeedbackErrorMessage,
    normalizeFeedbackFields,
    type FeedbackFields,
    validateFeedbackFields,
} from "@/lib/feedbackValidation";
import {storeFeedback, storeTelegramDelivery} from "@/lib/feedbackStorage";
import {sendTelegramMessage} from "@/lib/telegram";

export const runtime = "nodejs";

// ─── Простой rate-limit в памяти (per IP) ────────────────────────────────────
const rateMap = new Map<string, { count: number; ts: number }>();
const RATE_LIMIT = 3;       // заявок
const RATE_WINDOW = 60_000; // за 60 секунд

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateMap.get(ip);

    if (!entry || now - entry.ts > RATE_WINDOW) {
        rateMap.set(ip, {count: 1, ts: now});
        return false;
    }
    if (entry.count >= RATE_LIMIT) return true;

    entry.count++;
    return false;
}

// ─── Telegram уведомление ──────────────────────────────────────────────────────
async function sendToTelegram(fields: FeedbackFields) {
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
        throw new Error("TELEGRAM_CHAT_ID is not configured");
    }

    await sendTelegramMessage({
        chatId,
        text: buildFeedbackTelegramMessage(fields),
    });
}

// ─── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    // Rate limit
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    if (isRateLimited(ip)) {
        return NextResponse.json(
            {error: "Слишком много запросов. Попробуйте позже."},
            {status: 429}
        );
    }

    // Парсинг тела
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({error: "Неверный формат данных"}, {status: 400});
    }

    // Валидация
    const fields: FeedbackFields = {
        name: typeof body.name === "string" ? body.name : "",
        phone: typeof body.phone === "string" ? body.phone : "",
        email: typeof body.email === "string" ? body.email : "",
    };

    const validationError = getFeedbackErrorMessage(
        validateFeedbackFields(fields)
    );
    if (validationError) {
        return NextResponse.json({error: validationError}, {status: 422});
    }

    const normalizedFields = normalizeFeedbackFields(fields);
    let feedbackId: string | null = null;

    try {
        feedbackId = await storeFeedback(normalizedFields);
    } catch (error) {
        console.error("Feedback storage error:", error);
    }

    try {
        await sendToTelegram(normalizedFields);
        if (feedbackId) {
            await storeTelegramDelivery({id: feedbackId}).catch((storageError) =>
                console.error("Feedback delivery storage error:", storageError)
            );
        }
        return NextResponse.json({ok: true, delivery: "telegram"}, {status: 200});
    } catch (error) {
        console.error("Telegram send error:", error);

        if (feedbackId) {
            await storeTelegramDelivery({
                id: feedbackId,
                error: error instanceof Error ? error.message : "Unknown error",
            }).catch((storageError) =>
                console.error("Feedback delivery storage error:", storageError)
            );

            return NextResponse.json(
                {ok: true, delivery: "stored"},
                {status: 202}
            );
        }

        return NextResponse.json(
            {error: "Не удалось принять заявку. Попробуйте ещё раз."},
            {status: 502}
        );
    }
}
