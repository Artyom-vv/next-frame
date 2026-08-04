import {afterEach, describe, expect, it, vi} from "vitest";

import {sendTelegramMessage, TelegramDeliveryError} from "./telegram";

const originalToken = process.env.TELEGRAM_BOT_TOKEN;
const originalRelayUrl = process.env.TELEGRAM_RELAY_URL;
const originalRelaySecret = process.env.TELEGRAM_RELAY_SECRET;

afterEach(() => {
    process.env.TELEGRAM_BOT_TOKEN = originalToken;
    process.env.TELEGRAM_RELAY_URL = originalRelayUrl;
    process.env.TELEGRAM_RELAY_SECRET = originalRelaySecret;
    vi.unstubAllGlobals();
});

describe("sendTelegramMessage", () => {
    it("sends an HTML message to the requested chat", async () => {
        process.env.TELEGRAM_BOT_TOKEN = "test-token";
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ok: true}), {status: 200})
        );
        vi.stubGlobal("fetch", fetchMock);

        await sendTelegramMessage({chatId: "407167001", text: "<b>Тест</b>"});

        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.telegram.org/bottest-token/sendMessage",
            expect.objectContaining({method: "POST"})
        );
    });

    it("throws when Telegram rejects the message", async () => {
        process.env.TELEGRAM_BOT_TOKEN = "test-token";
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(
                new Response(
                    JSON.stringify({ok: false, description: "Forbidden: bot was blocked by the user"}),
                    {status: 403}
                )
            )
        );

        await expect(
            sendTelegramMessage({chatId: "407167001", text: "Тест"})
        ).rejects.toThrow(TelegramDeliveryError);
    });

    it("uses the Cloudflare relay when it is configured", async () => {
        process.env.TELEGRAM_RELAY_URL = "https://frame-telegram-relay.example.workers.dev";
        process.env.TELEGRAM_RELAY_SECRET = "relay-secret";
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ok: true}), {status: 200})
        );
        vi.stubGlobal("fetch", fetchMock);

        await sendTelegramMessage({chatId: "407167001", text: "Тест"});

        expect(fetchMock).toHaveBeenCalledWith(
            process.env.TELEGRAM_RELAY_URL,
            expect.objectContaining({
                headers: expect.objectContaining({"x-relay-secret": "relay-secret"}),
            })
        );
    });
});
