# Deployment Guide

This walks you through putting this site online and connecting it to
Firebase (the database + login) and Cloudinary (image storage), using
Vercel as the host. No coding needed — just following along and clicking in
the right places. Budget about 30–40 minutes the first time.

Do the parts in order: **Part 1 → 6**. Each part tells you exactly where to
click.

---

## What you'll need first

- A free [Vercel](https://vercel.com) account (sign up with your GitHub account — easiest option)
- A free [Firebase](https://firebase.google.com) account (same Google account you'll use to log into the admin dashboard)
- A free [Cloudinary](https://cloudinary.com) account
- Access to the GitHub repository this project lives in

---

## Part 1 — Deploy the site to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in (use **Continue with GitHub**).
2. You'll see **"Import Git Repository."** Find this project's repository in the list and click **Import** next to it.
   - If you don't see it, click **"Adjust GitHub App Permissions"** and grant Vercel access to the repository.
3. On the next screen ("Configure Project"):
   - **Framework Preset** should already say "Next.js" — leave it.
   - Leave **Build and Output Settings** as default.
   - You'll see a section called **Environment Variables** — **skip it for now**, leave it empty. We'll come back to it in Part 5, once we have the actual values.
4. Click the big **Deploy** button.
5. Vercel will build the site. The first build will look "working" and then show a congratulations screen — that's expected, even though the site isn't fully connected to anything yet.
6. Click **Continue to Dashboard**. Note the URL shown at the top (something like `your-project-name.vercel.app`) — you'll need it in Part 4.

You now have a live URL, but the site is running on placeholder data. The next parts connect it to real data.

---

## Part 2 — Create your Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com).
2. Click **Add project** (or **Create a project**).
3. Give it any name (e.g. "my-portfolio") → **Continue**.
4. You'll be asked about Google Analytics — toggle it **off** (not needed) → **Create project**.
5. Wait for it to finish, then click **Continue**.

### 2a. Turn on the database (Firestore)

1. In the left sidebar, click **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode** → **Next**.
4. Pick a location close to you (any is fine) → **Enable**.

### 2b. Turn on Google sign-in (this is how you'll log into /admin)

1. In the left sidebar, click **Build → Authentication**.
2. Click **Get started**.
3. Click the **Sign-in method** tab.
4. Click **Google** from the provider list.
5. Toggle **Enable** on.
6. Pick a "Project support email" from the dropdown (your own email is fine).
7. Click **Save**.

That's all — you don't need to manually create a user account. Signing in with Google on the live site will create your account automatically. (Only one specific email is allowed into the dashboard — see the note at the end of this guide.)

---

## Part 3 — Get your Firebase keys

You need two separate sets of keys from Firebase: one for the website itself, one for the admin dashboard's server.

### 3a. Website config (public keys)

1. Click the **gear icon** ⚙️ next to "Project Overview" (top-left) → **Project settings**.
2. Scroll down to **"Your apps."** Click the **`</>`** icon (this means "add a web app").
3. Give it any nickname (e.g. "portfolio-web") → click **Register app**.
4. You'll now see a code block with a `firebaseConfig = { ... }` object. Keep this tab open — you'll copy six values from it in Part 5:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
5. Click **Continue to console** to dismiss the rest of the setup screen (you can ignore the SDK install instructions).

### 3b. Admin / server key (private — keep this secret)

1. Still in **Project settings**, click the **Service accounts** tab.
2. Click **Generate new private key** → confirm **Generate key**.
3. A `.json` file downloads to your computer. Open it with any text editor (Notepad, TextEdit, VS Code).
4. Inside, you'll see three fields you need in Part 5:
   - `"project_id"`
   - `"client_email"`
   - `"private_key"` (this is long and starts with `-----BEGIN PRIVATE KEY-----`)
5. Keep this file private — don't upload it anywhere or share it. Treat it like a password.

---

## Part 4 — Get your Cloudinary keys

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (or log in).
2. You'll land on your **Dashboard**. Near the top, there's a **"Product Environment Credentials"** or **"API Keys"** panel showing:
   - **Cloud name**
   - **API Key**
   - **API Secret** (click the eye icon 👁 to reveal it)
3. Keep this tab open for Part 5.

---

## Part 5 — Enter everything into Vercel

This is the step that connects everything together.

1. Go back to [vercel.com](https://vercel.com) → open your project → click the **Settings** tab → **Environment Variables** in the left menu.
2. Add each of the following one at a time: type the **Key** (name), paste the **Value**, leave all three environments (Production/Preview/Development) checked, then click **Save**. Repeat for every row below.

| Key (type exactly as shown) | Value (where it comes from) |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` from Part 3a |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` from Part 3a |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` from Part 3a |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` from Part 3a |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` from Part 3a |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` from Part 3a |
| `FIREBASE_ADMIN_PROJECT_ID` | `project_id` from Part 3b |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `client_email` from Part 3b |
| `FIREBASE_ADMIN_PRIVATE_KEY` | `private_key` from Part 3b — paste the **whole thing**, quotes and all, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name from Part 4 |
| `CLOUDINARY_API_KEY` | API Key from Part 4 |
| `CLOUDINARY_API_SECRET` | API Secret from Part 4 |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL from Part 1, step 6 (e.g. `https://your-project-name.vercel.app`) |
| `ADMIN_EMAIL` | The one Google email allowed to log into `/admin` (defaults to `innocentericmuzamil@gmail.com` if you skip this) |

3. Once every row is added, go to the **Deployments** tab (top of the page).
4. Click the **⋯** (three dots) menu on the most recent deployment → **Redeploy** → confirm **Redeploy**.
   - This step matters — Vercel only picks up new environment variables on a fresh deployment, not automatically.

---

## Part 6 — Connect your domain to Firebase, then test

1. Back in Firebase Console → **Authentication → Settings** tab → **Authorized domains**.
2. Click **Add domain**, paste in your Vercel URL without `https://` (e.g. `your-project-name.vercel.app`) → **Add**.
   - (`localhost` is already listed by default, for testing on your own computer.)
3. Go to Firebase Console → **Firestore Database → Rules** tab.
4. Replace the contents with what's in this project's `firestore.rules` file, then click **Publish**.
5. Visit `https://your-project-name.vercel.app/admin/login` and click **Sign in with Google**, using the Google account set as `ADMIN_EMAIL`.
6. You should land on the dashboard. From here you can edit everything — see `ADMIN_SETUP.md` for what each section does.

---

## If something doesn't work

- **"This Google account is not authorized" message** → the email you signed in with doesn't match `ADMIN_EMAIL` in Vercel's Environment Variables. Double-check for typos, then redeploy.
- **Google sign-in popup closes immediately / errors** → your domain probably isn't in Firebase's Authorized domains list (Part 6, step 1–2).
- **Site shows placeholder/sample content instead of your own** → that's expected until you fill in `/admin/settings` and save once.
- **Images won't upload** → double-check the three `CLOUDINARY_*` values in Vercel for typos.
- **Changed an environment variable but nothing changed on the live site** → you need to manually **Redeploy** (Part 5, step 4) — Vercel doesn't auto-apply env var changes to existing deployments.

Once deployed and connected, day-to-day editing (projects, experience, skills,
testimonials, messages) is covered in **`ADMIN_SETUP.md`**.
