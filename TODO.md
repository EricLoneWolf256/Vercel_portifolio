# Admin CMS build-out

Goal: every piece of content on the public site (text, images, links) becomes
editable from a password-protected `/admin` dashboard, backed by Firestore
(data) + Cloudinary (images), so this codebase can be handed to a non-technical
owner who only needs to plug in their own Firebase project + Cloudinary
account and create one login user. No code changes required per-owner.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Phase 0 — Architecture decisions (locked in, documented here so we don't re-litigate)

- **Auth**: Firebase Authentication, **Google sign-in only** (changed from the
  original Email/Password plan — see "Auth update" below). Access is
  restricted to a single allow-listed email (`ADMIN_EMAIL`, defaulting to
  `innocentericmuzamil@gmail.com`), enforced server-side both when the
  session cookie is issued and on every subsequent `verifySession()` check —
  Google sign-in itself auto-creates a Firebase user for any Google account,
  so Firebase doesn't gate *who* can sign in; this app does.
- **Session**: Firebase ID token (client sign-in) → exchanged server-side for
  an HttpOnly session cookie via `firebase-admin`'s `createSessionCookie`.
  `proxy.ts` does a cheap cookie-presence check (optimistic); the admin
  layout does the real `verifySessionCookie` check (secure) — this is the
  pattern from the Next.js auth guide (`node_modules/next/dist/docs/01-app/02-guides/authentication.md`).
- **Writes**: ALL Firestore writes happen through Server Actions using
  `firebase-admin` (service account), never directly from the browser. This
  means Firestore security rules can simply block all client writes —
  no per-user rule logic needed.
- **Images**: Cloudinary, uploaded via a Server Action using the existing
  `cloudinary` server SDK (same credentials `scripts/upload-cloudinary.ts`
  already uses: `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` /
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`). Admin forms get a file input that
  uploads and stores the returned `public_id` on the doc, same as today.
- **No new environment variables.** Everything needed already exists in the
  current Firebase + Cloudinary env vars this repo already reads.
- **Route tree**:
  ```
  src/app/
    (public)/              ← route group, no URL segment
      layout.tsx           ← Navbar + children + Footer + ResumeFAB
      page.tsx             ← home (moved from app/page.tsx)
      projects/[slug]/page.tsx
    admin/
      login/page.tsx       ← public, outside the auth-guarded group
      (dashboard)/         ← route group, auth-guarded by its layout.tsx
        layout.tsx
        page.tsx           ← /admin overview
        settings/page.tsx
        projects/{page.tsx,new/page.tsx,[id]/page.tsx}
        experience/{...}
        skills/{...}
        testimonials/{...}
        messages/page.tsx
    api/auth/session/route.ts
  src/proxy.ts              ← renamed from middleware.ts (Next.js 16 convention)
  firestore.rules
  .env.example
  ```

## Phase 1 — Auth foundation

- [x] Confirm Next.js 16 uses `proxy.ts` (not `middleware.ts`) — verified against installed `node_modules/next/dist/docs/`.
- [x] Add `auth` export to `src/lib/firebase.ts` (client Firebase Auth instance).
- [x] `src/lib/auth/session.ts` — server-only DAL: `verifySession()` (decrypts/verifies the session cookie via `firebase-admin`, cached per-request).
- [x] `src/app/api/auth/session/route.ts` — `POST` creates the session cookie from an ID token, `DELETE` clears it.
- [x] `src/proxy.ts` — optimistic cookie-presence redirect for `/admin/*` (except `/admin/login`).
- [x] `src/app/admin/login/page.tsx` — email/password form, Firebase client sign-in, posts ID token to the session route.
- [x] `src/app/admin/(dashboard)/layout.tsx` — secure `verifySession()` check + redirect; renders the admin shell (sidebar nav + logout).
- [x] `src/components/admin/AdminShell.tsx` + logout button + dashboard home page.

## Phase 2 — Route restructure

- [x] Move `src/app/page.tsx` → `src/app/(public)/page.tsx`.
- [x] Move `src/app/projects/[slug]/page.tsx` → `src/app/(public)/projects/[slug]/page.tsx`.
- [x] `src/app/(public)/layout.tsx` — hoist `<Navbar/><Footer/><ResumeFAB/>` here so both pages share them (project detail page didn't have site nav before — bug fix as a side effect).
- [x] `tsc --noEmit` clean after the move (route groups don't change URLs, aliases unaffected).

## Phase 3 — Site Settings (identity, Hero, About, SEO) made editable

- [x] `SiteSettings` type in `src/types/index.ts`.
- [x] `src/lib/data/settings.ts` — `getSiteSettings()`, Firestore `settings/site` doc merged over current `siteConfig.ts` values as defaults (never breaks if the doc doesn't exist yet). Deduped per-request via React `cache()`.
- [x] Thread `settings` as a prop through: `(public)/layout.tsx`, `(public)/page.tsx` → `Navbar`, `Footer`, `ResumeFAB`, `MobileNav`, `Hero`, `About`, `Contact` (replacing direct `siteConfig` imports with the fetched/passed-down settings). `siteConfig.nav` import kept as-is (structural, see "known limitations").
- [x] Root `layout.tsx` `generateMetadata()` + JSON-LD now read `getSiteSettings()` instead of the static import.
- [x] Fixed an eager-init crash this surfaced: both `firebase.ts`'s `getAuth()` and `firebase-admin.ts`'s `cert()`/`initializeApp()` validate/throw at module-load time when env vars are missing, which broke `next build` for anything importing them (sitemap, the new session route). Converted both to lazy singletons (`getFirebaseAuth()`, `getAdminApp()`/`getAdminDb()`) and updated all call sites (`contact.ts`, `session.ts`, the session route, the dashboard page, login page, logout button).
- [x] `src/app/admin/(dashboard)/settings/actions.ts` — `updateSiteSettings()` Server Action (writes `settings/site`, revalidates `/`).
- [x] `src/app/admin/(dashboard)/settings/page.tsx` + `SettingsForm.tsx` — covers identity, availability, resume (upload or paste), socials, avatar upload, About bio/stats (add/remove via `useFieldArray`)/values, SEO.
- [x] Avatar image upload wired through the shared Cloudinary upload action; resume upload got its own `uploadResume()` action (raw/PDF resource type, since `uploadImage` only accepts images) and `ResumeUploadField` component.
- [x] `tsc`/`eslint`/`npm run build` all clean. **Phase 3 fully done.**

## Phase 4 — Cloudinary upload Server Action (shared by every section)

- [x] `src/lib/admin/upload-action.ts` — `uploadImage(formData, folder)` Server Action, signed upload via the `cloudinary` SDK, returns `public_id`. Re-verifies the admin session before uploading.
- [x] `src/components/admin/ImageUploadField.tsx` — reusable client component (file input + live preview + upload progress/error) used everywhere a `*PublicId` field needs editing.

## Phase 5 — Projects CRUD (reference implementation for the rest)

- [x] `src/app/admin/(dashboard)/projects/actions.ts` — `saveProject`/`deleteProject`, re-verifies session, revalidates `/` and `/projects/[slug]`.
- [x] `src/app/admin/(dashboard)/projects/page.tsx` — list with edit/delete.
- [x] `src/app/admin/(dashboard)/projects/new/page.tsx` + `[id]/page.tsx` — shared `ProjectForm` component. Also added `src/lib/admin/types.ts` (shared `AdminActionResult`) and `src/components/admin/DeleteButton.tsx` (reused by every future section).
- [x] `tsc`/`eslint`/`npm run build` all clean with this slice in place.

## Phase 6 — Experience CRUD (same pattern as Phase 5)

- [x] actions.ts (`saveExperience`/`deleteExperience`, converts date-input strings to Firestore `Timestamp`s, `null` end = current role), list page, new/edit pages, `ExperienceForm`.
- [x] Fixed a real bug this surfaced: `toDate()` in `src/lib/utils.ts` used `instanceof Timestamp` against the **client** SDK's Timestamp class, which silently returned `null` for dates read via `adminDb` (the Admin SDK has its own distinct `Timestamp` class). Switched to duck-typing (`typeof value.toDate === 'function'`) so it works for both.
- [x] `tsc`/`eslint`/`npm run build` all clean.

## Phase 7 — Skills CRUD (same pattern)

- [x] actions.ts, list page (grouped by category via existing `getSkills()`), new/edit pages, `SkillForm`.

## Phase 8 — Testimonials CRUD (same pattern)

- [x] actions.ts, list page, new/edit pages, `TestimonialForm`.
- [x] `tsc`/`eslint`/`npm run build` all clean with Projects+Experience+Skills+Testimonials CRUD all in place.

## Phase 9 — Contact messages inbox

- [x] `src/app/admin/(dashboard)/messages/page.tsx` — list `contact_submissions` (already written by the existing contact form), mark read/unread, delete.
- [x] `src/app/admin/(dashboard)/messages/actions.ts`.
- [x] `tsc`/`eslint`/`npm run build` all clean.

## Phase 10 — Security & handoff docs

- [x] `firestore.rules` — public read for `projects` / `experience` / `skills` / `testimonials` / `settings`; no client reads for `contact_submissions`; **no client writes anywhere** (everything goes through `firebase-admin`); restored the explicit `match /{document=**} { allow read, write: if false }` catch-all for defense in depth. **Note:** this file already existed (`allow write: if request.auth != null` — a leftover from a client-side-write architecture the contact Server Action had already moved away from) and I overwrote it without reading it first; the new version matches the server-only-writes architecture this build settled on, but flagging the overwrite since it skipped the read-before-write step.
- [x] `.env.example` — every var the owner needs to supply, with a one-line comment each. Added `!.env.example` to `.gitignore` (the blanket `.env*` rule would otherwise exclude it).
- [x] `ADMIN_SETUP.md` — plain-language handoff doc: create Firebase project → enable Firestore + rules → enable Email/Password auth → add yourself as a user → get client config + admin service account → get Cloudinary keys → fill `.env.local` → set the same vars on the host → log in at `/admin`.
- [x] Rewrote `README.md` (was still the untouched create-next-app boilerplate) — points to `ADMIN_SETUP.md`, documents the stack and route structure.

## Phase 11 — Verification

- [x] `tsc --noEmit` clean (full repo).
- [x] `eslint` clean on every new/changed file. A full-repo lint still reports 10 pre-existing issues (3 errors, 7 warnings) — all confirmed via `git diff --stat` to be in files this build either never touched or touched only in unrelated lines: `AvailabilityBadge.tsx`, `Experience.tsx`, `lib/data/projects.ts` (untouched), plus unrelated lines in `contact.ts`/`utils.ts`. One new warning (`ExperienceForm.tsx`'s `watch()` — a React Compiler memoization advisory, not an error) was introduced by this build and is safe to ignore.
- [x] `npm run build` succeeds — all 20 routes compile, including every `/admin/*` route and `proxy.ts`.
- [ ] Manual smoke test with a real Firebase project (can't be done in this environment — no live Firebase project is connected here; the owner/dev should do this once `.env.local` is filled in, per `ADMIN_SETUP.md`).

---

## Auth update — switched to Google sign-in, single allow-listed email

After Phase 11 (initial build complete), the login method changed from
Email/Password to Google OAuth, restricted to one email:

- [x] `src/lib/auth/session.ts` — added `ADMIN_EMAIL` constant (env var,
  defaults to `innocentericmuzamil@gmail.com`); `verifySession()` now rejects
  any session whose decoded email doesn't match.
- [x] `src/app/api/auth/session/route.ts` — now calls `verifyIdToken()` and
  checks the email **before** issuing a session cookie (403 if it doesn't
  match), instead of trusting any valid Firebase ID token.
- [x] `src/app/admin/login/page.tsx` — replaced the email/password form with
  a single "Sign in with Google" button (`GoogleAuthProvider` +
  `signInWithPopup`).
- [x] `.env.example` / `ADMIN_SETUP.md` — updated: enable **Google** (not
  Email/Password) as the sign-in method in Firebase Console, no manual "add
  user" step needed, documented the `ADMIN_EMAIL` restriction and the
  Authorized domains requirement for OAuth popups.
- [x] `tsc`/`eslint`/`npm run build` all clean.

---

## Deployment doc added

- [x] `DEPLOYMENT.md` — click-by-click, non-technical walkthrough covering:
  deploying to Vercel (import from GitHub, where the env vars UI is),
  creating the Firebase project + Firestore + Google sign-in, getting both
  Firebase key sets (client config + Admin SDK service account), getting
  Cloudinary keys, a full env-var-to-source mapping table for Vercel's
  Environment Variables screen, adding the deployed domain to Firebase's
  Authorized domains, publishing `firestore.rules`, and a troubleshooting
  section.
- [x] Trimmed `ADMIN_SETUP.md` down to "how to use the dashboard once it's
  live" (it previously duplicated the Firebase/Cloudinary account-creation
  steps that now live in `DEPLOYMENT.md` — two docs saying slightly
  different things about the same setup would've drifted out of sync).
- [x] `README.md` now links both docs with a one-line description of which
  is for what.

---

## Known limitations / explicitly out of scope for this pass

- Nav links (`siteConfig.nav`) stay code-level, not admin-editable — they're
  tied 1:1 to actual page anchors; making them freely editable risks the
  owner pointing a nav link at a section that doesn't exist. Revisit only if
  asked.
- No multi-admin roles/permissions — see Phase 0, by design.
- No rich-text editor for bio/description fields — plain `<textarea>` with
  one-paragraph-per-line for bio. Good enough for v1; swap in a rich text
  lib later if wanted.
- No image cropping UI in the admin — uploads go through as-is; the existing
  `getCloudinaryUrl()` transforms handle sizing on display.
