# ZQX Consulting S.A. Website (Next.js)

## Run locally
```bash
npm install
npm run dev
```

Open:
- http://localhost:3000 (redirects to /en)
- http://localhost:3000/en
- http://localhost:3000/es

## Edit company details
Update:
- `lib/site.ts` (email, whatsapp, etc.)
- `lib/dictionaries/*` (copy and translations)

## Chat assistant
The floating chat works with guided site answers by default. To enable AI-generated answers, set:

```bash
OPENAI_API_KEY=your_api_key
OPENAI_CHAT_MODEL=gpt-5.4-mini
```

If `OPENAI_API_KEY` is missing or the AI request fails, the chat falls back to local answers based on the site copy.

## Deploy
Push to GitHub and import into Vercel.

## Change log

### 2026-06-02

- Restored the header branding to use `public/zqx.svg`, matching the platform demo logo.
- Fixed navigation so the logo opens the AI game while the text label returns to the home page.
- Kept the mobile header compact: only `ZQX` plus the game shortcut.
- Kept the desktop header full: `ZQX Digital Consulting` plus the game shortcut.
- Updated the platform demo CTA so it points to the system login flow instead of a broken path.
