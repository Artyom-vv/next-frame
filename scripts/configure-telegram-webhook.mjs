const token = process.env.TELEGRAM_BOT_TOKEN;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!token || !siteUrl || !secret) {
    throw new Error(
        "Set TELEGRAM_BOT_TOKEN, NEXT_PUBLIC_SITE_URL and TELEGRAM_WEBHOOK_SECRET before configuring the webhook."
    );
}

const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        url: `${siteUrl}/api/telegram/webhook`,
        secret_token: secret,
        allowed_updates: ["message"],
    }),
});

const payload = await response.json();

if (!response.ok || payload.ok !== true) {
    throw new Error(payload.description || `Telegram API returned HTTP ${response.status}`);
}

console.log("Telegram webhook configured.");
