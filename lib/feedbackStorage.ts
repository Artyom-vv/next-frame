import {randomUUID} from "node:crypto";
import {appendFile, mkdir} from "node:fs/promises";
import {dirname} from "node:path";

import type {FeedbackFields} from "@/lib/feedbackValidation";

type FeedbackEvent = {
    event: "feedback.received" | "feedback.telegram_sent" | "feedback.telegram_failed";
    id: string;
    at: string;
    fields?: FeedbackFields;
    error?: string;
};

const storagePath = () =>
    process.env.FEEDBACK_STORAGE_PATH || "/tmp/frame-feedback.jsonl";

async function writeEvent(event: FeedbackEvent) {
    const line = `${JSON.stringify(event)}\n`;

    console.info("feedback.event", line.trim());
    await mkdir(dirname(storagePath()), {recursive: true});
    await appendFile(storagePath(), line, "utf8");
}

export async function storeFeedback(fields: FeedbackFields) {
    const id = randomUUID();

    await writeEvent({
        event: "feedback.received",
        id,
        at: new Date().toISOString(),
        fields,
    });

    return id;
}

export async function storeTelegramDelivery({
    id,
    error,
}: {
    id: string;
    error?: string;
}) {
    await writeEvent({
        event: error ? "feedback.telegram_failed" : "feedback.telegram_sent",
        id,
        at: new Date().toISOString(),
        error,
    });
}
