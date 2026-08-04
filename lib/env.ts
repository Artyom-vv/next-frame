import {z} from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    TELEGRAM_BOT_TOKEN: z
        .string()
        .min(1, "TELEGRAM_BOT_TOKEN is required"),

    TELEGRAM_CHAT_ID: z
        .string()
        .min(1, "TELEGRAM_CHAT_ID is required"),

    TELEGRAM_WEBHOOK_SECRET: z.string().min(1).optional(),
    FEEDBACK_STORAGE_PATH: z.string().min(1).optional(),

    // Опционально, если позже захочешь email-канал
    RESEND_API_KEY: z.string().optional(),
    FEEDBACK_TO_EMAIL: z.string().email().optional(),
});

const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    TELEGRAM_WEBHOOK_SECRET: process.env.TELEGRAM_WEBHOOK_SECRET,
    FEEDBACK_STORAGE_PATH: process.env.FEEDBACK_STORAGE_PATH,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FEEDBACK_TO_EMAIL: process.env.FEEDBACK_TO_EMAIL,
});

if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Missing or invalid environment variables");
}

export const env = parsed.data;
