# Portfolio

A Next.js portfolio with a full admin dashboard — every piece of content
(text, images, links, projects, experience, skills, testimonials) is editable
from `/admin` and backed by Firestore + Cloudinary, so this can be handed off
to a non-technical owner who only needs their own Firebase + Cloudinary
accounts.

**Deploying this for the first time, or handing it off to someone else?**
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — click-by-click: put it on Vercel, connect Firebase + Cloudinary, where to paste every key.
- [`ADMIN_SETUP.md`](./ADMIN_SETUP.md) — what each `/admin` section does, once it's live.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Firestore (content) + Firebase Auth (the single `/admin` login) via `firebase` (client) and `firebase-admin` (server)
- Cloudinary (images + resume PDF)
- Framer Motion, react-hook-form + Zod, Vercel Analytics/Speed Insights

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your own values — see ADMIN_SETUP.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) for
the dashboard.

## Project structure

```
src/app/
  (public)/            # the public site — home page + /projects/[slug] case studies
  admin/
    login/             # public login page
    (dashboard)/        # everything under /admin, gated by layout.tsx's session check
  api/auth/session/     # exchanges a Firebase ID token for an HttpOnly session cookie
src/lib/
  data/                 # public read functions (client SDK) — getProjects(), getSiteSettings(), ...
  admin/                # shared admin-only helpers (Cloudinary upload action, shared types)
  auth/session.ts        # the secure session check (DAL) used by the dashboard layout + Server Actions
src/proxy.ts            # optimistic auth redirect for /admin/* (Next.js 16's renamed middleware)
firestore.rules          # public read / no client writes — all writes go through Server Actions
```

See `TODO.md` for the build log of how the admin dashboard was put together,
and what (if anything) is still outstanding.

## Optional: seed example content

```bash
npx tsx scripts/seed.ts
```

Populates Firestore with sample projects/experience/skills/testimonials to
develop against, or to give a new owner something to edit rather than a blank
dashboard.
