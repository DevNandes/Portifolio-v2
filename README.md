# Raphael Fernandes — Portfolio

A modern, bilingual (PT/EN) developer portfolio built with **Next.js 14**,
**TypeScript**, **Tailwind CSS** and **Framer Motion**, featuring a WebGL aurora
background and two interactive demos:

- **Live RPA demo** — an animated, illustrative reenactment of a browser-automation
  job: a fake browser, terminal and Postgres table animate in sync while a "bot"
  logs in, searches, scrapes case rows and persists them.
- **"Interview me" AI chat** — a Groq-powered assistant (Llama 3.3 70B) that
  answers questions in the first person, streaming token by token, so a recruiter
  can interview the candidate directly on the page.

---

## Tech stack

| Area      | Tools                                                  |
| --------- | ------------------------------------------------------ |
| Framework | Next.js 14 (App Router), React 18, TypeScript          |
| Styling   | Tailwind CSS, CSS custom properties (theme palette)    |
| Animation | Framer Motion, Three.js (WebGL shader background)      |
| Icons     | lucide-react                                           |
| AI        | groq-sdk (Llama 3.3 70B), streamed via a Route Handler |
| Tooling   | ESLint (next/core-web-vitals), Prettier                |

---

## Getting started

### Prerequisites

- Node.js 18.17+ (or 20+)
- A free [Groq API key](https://console.groq.com/keys) — optional, only the AI
  chat needs it.

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# open .env.local and paste your GROQ_API_KEY

# 3. Start the dev server
npm run dev
```

Open http://localhost:3000.

> Without `GROQ_API_KEY` the whole site still works — only the AI chat shows a
> friendly "set your key" notice.

### Available scripts

| Script                 | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start the dev server                      |
| `npm run build`        | Production build                          |
| `npm run start`        | Serve the production build                |
| `npm run lint`         | Lint with ESLint                          |
| `npm run typecheck`    | Type-check with `tsc --noEmit`            |
| `npm run format`       | Format the codebase with Prettier         |
| `npm run format:check` | Verify formatting without writing changes |

---

## Environment variables

| Variable       | Required | Description                                                               |
| -------------- | -------- | ------------------------------------------------------------------------- |
| `GROQ_API_KEY` | No\*     | Server-side key for the AI chat. \*Required only for the chat to respond. |

The key is read **only on the server** (in `app/api/chat/route.ts`) and is never
exposed to the browser.

---

## Project structure

```
portfolio/
├── app/
│   ├── api/chat/route.ts     # Streaming Groq endpoint (rate-limited, validated)
│   ├── sections/             # Page sections
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── stack.tsx
│   │   ├── experience.tsx
│   │   ├── rpa-demo.tsx      # Live RPA demo
│   │   ├── ai-demo.tsx       # "Interview me" chat
│   │   ├── projects.tsx
│   │   └── contact.tsx       # Contact cards + footer
│   ├── globals.css           # Tailwind layers, theme variables, base styles
│   ├── icon.svg              # Favicon (RF mark)
│   ├── layout.tsx            # Root layout, metadata, viewport
│   └── page.tsx              # Composes the page
├── components/
│   ├── aurora-bg.tsx         # WebGL aurora background (Three.js shader)
│   ├── floating-chat.tsx     # Floating chat widget (all sections)
│   ├── nav.tsx               # Top navigation + language toggle
│   └── section.tsx           # Reusable section wrapper
├── lib/
│   ├── i18n.tsx              # PT/EN language context
│   └── utils.ts              # Small shared helpers
├── next.config.mjs           # Security headers + CSP
├── tailwind.config.ts        # Theme (colors driven by CSS variables)
└── package.json
```

---

## How the demos work

### Live RPA demo (`app/sections/rpa-demo.tsx`)

A purely visual, **illustrative** reenactment of browser-automation (RPA) work:
the "bot" opens a headless browser (Playwright), fills the login form, types a
filter, reads a results table, scrapes each case's fields (id, amount, court) and
saves them to PostgreSQL. It interacts with the page like a human — it is **not**
an API call. No real data is fetched; the numbers are placeholders.

### AI chat (`app/sections/ai-demo.tsx` + `app/api/chat/route.ts`)

The browser POSTs the recent conversation to `/api/chat`. The route validates and
trims the payload, then calls Groq with a system prompt describing the candidate's
profile, and streams the answer back as plain text. The frontend renders it token
by token. The same engine powers the floating chat widget
(`components/floating-chat.tsx`).

Default model: `llama-3.3-70b-versatile` (swap it in `app/api/chat/route.ts`).

---

## Internationalization (PT / EN)

A lightweight context (`lib/i18n.tsx`) holds the active language. The preference
is saved to `localStorage` and guessed from the browser on first visit; the nav
exposes a **PT / EN** toggle. Each section ships its own PT and EN strings, and
the AI answers in the active language.

---

## Security

- **Secrets stay server-side.** `GROQ_API_KEY` is only read in the Route Handler;
  it is never bundled into client code.
- **Rate limiting & input validation.** `/api/chat` applies a best-effort per-IP
  rate limit and caps message count and length before calling the model. (For
  multi-instance production traffic, back the limiter with a shared store such as
  Vercel KV / Upstash Redis.)
- **HTTP hardening headers.** `next.config.mjs` sets a Content-Security-Policy
  plus `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` and HSTS, and disables the `X-Powered-By` header.
- **Safe external links.** Outbound links use `rel="noopener noreferrer"`.

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. In **Project → Settings → Environment Variables**, add `GROQ_API_KEY`.
4. Deploy. Vercel auto-detects Next.js — no extra configuration needed.

---

© Raphael Fernandes. Personal portfolio project.
