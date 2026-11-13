# Using your admin dashboard

This site has an admin dashboard at `/admin` where you can edit everything —
your name, bio, photo, resume, social links, WhatsApp number, projects, work
history, skills, and testimonials. No coding required for any of it.

**First time setting this up?** This doc assumes the site is already deployed
and connected to Firebase + Cloudinary. If that's not done yet, start with
[`DEPLOYMENT.md`](./DEPLOYMENT.md) instead — it covers putting the site on
Vercel and connecting everything, step by step. Come back here once that's
done.

## Logging in

Visit `yourdomain.com/admin/login` and sign in — with the **Sign in with
Google** button, or the email/password form, whichever was set up for you.
Only one specific email is allowed in (set as `ADMIN_EMAIL` when the site was
deployed) — anyone else signing in, with either method, gets a clear "not
authorized" message.

## What each section does

- **Site Settings** — your name, title, tagline, bio, avatar photo, resume
  (upload a PDF directly or paste a link), availability status, social
  links, WhatsApp number (shows a floating WhatsApp button when set, hidden
  when blank), the "About" section's stats and values, and SEO info.
- **Projects** — add, edit, or delete projects. Mark one or more as
  "Flagship" to give it the larger spotlight treatment on the homepage.
  Upload a screenshot directly from the form.
- **Experience** — your work history timeline. Check "This is my current
  role" to leave a job open-ended instead of picking an end date.
- **Skills** — your tech stack, grouped by category (the category name you
  type is what groups things together — reuse the same category name for
  skills that belong together).
- **Testimonials** — quotes from colleagues or clients, with an optional
  photo and LinkedIn link.
- **Messages** — the site no longer has a public contact form, so this stays
  empty going forward; it's kept around only to view/delete any older
  submissions already on file.

Every change goes live within a few seconds — no redeploy needed.

## Optional: start with example content

If you want to see the dashboard with some example data already in it before
adding your own, a developer can run `npx tsx scripts/seed.ts` (with
`.env.local` filled in) — this adds a few sample projects/experience/skills/
testimonials you can then edit or delete from `/admin`.

## If something looks wrong

- **Can't log in / "not authorized" message?** You're signing in with a
  different account than the one set as `ADMIN_EMAIL`. See `DEPLOYMENT.md`
  to check or change it.
- **Site shows placeholder content?** That means the Site Settings form
  hasn't been saved yet — open `/admin/settings`, fill it in, and click
  Save once.
- **Images not uploading?** The Cloudinary keys are likely misconfigured —
  see `DEPLOYMENT.md` Part 4–5.
