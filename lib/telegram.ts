const TELEGRAM_API_BASE_URL = "https://api.telegram.org";
const TELEGRAM_REQUEST_TIMEOUT_MS = 8_000;

type TelegramApiResponse = {
    ok?: boolean;
    description?: string;
};

export class TelegramDeliveryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TelegramDeliveryError";
    }
}

export async function sendTelegramMessage({
    chatId,
    text,
}: {
    chatId: string | number;
    text: string;
}) {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        throw new TelegramDeliveryError("TELEGRAM_BOT_TOKEN is not configured");
    }

    const response = await fetch(
        `${TELEGRAM_API_BASE_URL}/bot${token}/sendMessage`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({chat_id: chatId, text, parse_mode: "HTML"}),
            signal: AbortSignal.timeout(TELEGRAM_REQUEST_TIMEOUT_MS),
        }
    );

    const payload = (await response.json().catch(() => null)) as TelegramApiResponse | null;

    if (!response.ok || payload?.ok !== true) {
        throw new TelegramDeliveryError(
            payload?.description || `Telegram API returned HTTP ${response.status}`
        );
    }
}
