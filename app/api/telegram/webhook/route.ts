import {NextRequest, NextResponse} from "next/server";

import {sendTelegramMessage} from "@/lib/telegram";

export const runtime = "nodejs";

type TelegramUpdate = {
    message?: {
        text?: string;
        chat?: {id?: number};
    };
};

export async function POST(request: NextRequest) {
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (!expectedSecret) {
        console.error("Telegram webhook rejected: TELEGRAM_WEBHOOK_SECRET is not configured");
        return NextResponse.json({ok: false}, {status: 503});
    }

    if (
        request.headers.get("x-telegram-bot-api-secret-token") !== expectedSecret
    ) {
        return NextResponse.json({ok: false}, {status: 401});
    }

    const update = (await request.json().catch(() => null)) as TelegramUpdate | null;
    const chatId = update?.message?.chat?.id;
    const text = update?.message?.text?.trim();

    if (!text?.startsWith("/start") || !chatId) {
        return NextResponse.json({ok: true});
    }

    try {
        await sendTelegramMessage({
            chatId,
            text: "Здравствуйте! Сюда будут приходить новые заявки с сайта Frame.",
        });
        return NextResponse.json({ok: true});
    } catch (error) {
        console.error("Telegram start reply failed:", error);
        return NextResponse.json({ok: false}, {status: 502});
    }
}
