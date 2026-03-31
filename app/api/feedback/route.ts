// app/api/feedback/route.ts
import {NextRequest, NextResponse} from "next/server";

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

// ─── Валидация ─────────────────────────────────────────────────────────────────
function validate(data: Record<string, unknown>): string | null {
    const {name, phone, email} = data;

    if (!name || typeof name !== "string" || !name.trim())
        return "Укажите имя";
    if (!phone || typeof phone !== "string" || phone.replace(/\D/g, "").length < 10)
        return "Некорректный номер телефона";
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return "Некорректный адрес почты";

    return null;
}

// ─── Telegram уведомление ──────────────────────────────────────────────────────
async function sendToTelegram(name: string, phone: string, email: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) return;

    const text = [
        `📩 *Новая заявка*`,
        ``,
        `👤 *Имя:* ${name}`,
        `📞 *Телефон:* ${phone}`,
        `📧 *Почта:* ${email}`,
        ``,
        `🕐 ${new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"})}`,
    ].join("\n");

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "Markdown",
        }),
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
    const validationError = validate(body);
    if (validationError) {
        return NextResponse.json({error: validationError}, {status: 422});
    }

    const {name, phone, email} = body as {
        name: string;
        phone: string;
        email: string;
    };

    // Отправка уведомления
    try {
        await sendToTelegram(name.trim(), phone.trim(), email.trim());
    } catch (err) {
        console.error("Telegram send error:", err);
        // Не возвращаем ошибку клиенту — логируем и продолжаем
    }

    return NextResponse.json({ok: true}, {status: 200});
}