This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Feedback form and Telegram

The feedback form requires these production variables:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
NEXT_PUBLIC_SITE_URL=https://frame-monolit.ru
```

When the hosting platform cannot connect to `api.telegram.org`, send messages
through the Cloudflare Worker relay instead. Add both variables in the hosting
environment (the secret must match the Worker secret named `RELAY_SECRET`):

```env
TELEGRAM_RELAY_URL=https://frame-telegram-relay.framesite.workers.dev
TELEGRAM_RELAY_SECRET=
```

With the relay configured, `TELEGRAM_BOT_TOKEN` is not used for form delivery.

The API records every accepted request in the application logs and appends it to
`/tmp/frame-feedback.jsonl` by default. Set `FEEDBACK_STORAGE_PATH` to a mounted
persistent directory when one is available; the standard App Platform filesystem
may be cleared during a redeploy.

To make the bot reply to `/start`, create a random `TELEGRAM_WEBHOOK_SECRET`, add
it to the production variables, then configure the webhook once from a trusted
machine:

```bash
TELEGRAM_BOT_TOKEN=... \
NEXT_PUBLIC_SITE_URL=https://frame-monolit.ru \
TELEGRAM_WEBHOOK_SECRET=... \
npm run telegram:webhook
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
