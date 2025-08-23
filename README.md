# HiHami

Full-stack Next.js app with Supabase auth (custom email verification via OTP), profile management, and password reset flow. Animated UI built with motion.

## Features

- Next.js App Router (src/app)
- Supabase Auth (SSR cookies via `@supabase/ssr`)
- Signup with username + email/password
  - OTP verification emailed via Resend
  - OTP expires after 10 minutes
- Login with email/password
  - Blocks unverified users
  - Custom message if email doesn’t exist
- Forgot password
  - Sends Supabase reset link
  - Non-enumerable responses (always generic success)
  - Reset page updates password using recovery session
- Minimal user menu on Home page showing username and email
- Type-safe validation with Zod and React Hook Form

## Project Structure

- `src/lib/supabase/`
  - `server.ts`: SSR Supabase client with cookie management
  - `admin.ts`: service-role client for server actions
  - `browser.ts`: browser client for client-side flows (reset password)
- `src/app/api/auth/`
  - `signup/route.ts`: creates user, writes profile, generates OTP, sends email
  - `verify-otp/route.ts`: checks OTP + expiry, verifies auth email
  - `login/route.ts`: signs in; if fail, checks if email exists, returns tailored errors
  - `forgot-password/route.ts`: sends reset link and returns generic success
- `src/app/(auth)/`
  - `signup/`: signup UI
  - `login/`: login UI
  - `verify-email/`: OTP input UI (expects `uid` and `email` query)
  - `forgot-password/`: request reset UI
  - `reset-password/`: set new password after email link
- `src/app/Home/page.tsx`: sample home with user icon popover

## Requirements

Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # server-only
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # for building reset links

# Email provider for OTP (Resend)
RESEND_API_KEY=...
EMAIL_FROM="Enefty <noreply@your-domain.com>"
```

Database tables (Supabase):

- `profiles` (RLS as needed)
  - `id: uuid` (PK, references auth.users.id)
  - `username: text` (unique)
  - `is_verified: boolean`
  - `otp_code: text` (sha256 hex)
  - `otp_expires_at: timestamptz`

## Development

Install dependencies and run dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Auth Flows

1. Signup

- POST `/api/auth/signup` with email/password/username
- Creates user, saves profile, emails OTP
- UI redirects to `/verify-email?uid=...&email=...`

2. Verify Email

- POST `/api/auth/verify-otp` with `uid` + `otp`
- Verifies if OTP matches and not expired; sets `is_verified`

3. Login

- POST `/api/auth/login`
- If bad credentials and email not found: returns "You don't have an account. Sign up"
- If unverified: blocks login

4. Forgot/Reset Password

- POST `/api/auth/forgot-password` with email (always returns generic success)
- User clicks email link to `/reset-password?type=recovery...`
- Page updates password via `supabase.auth.updateUser({ password })`

## Notes

- OTP is 4 digits; stored as SHA-256 hash with 10-minute expiry.
- The forgot-password endpoint avoids account enumeration by returning generic success.
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in production for password reset links.

## Scripts

- `npm run dev` – start dev with Turbopack
- `npm run build` – build
- `npm run start` – start production server
- `npm run lint` – run eslint

## License

MIT
