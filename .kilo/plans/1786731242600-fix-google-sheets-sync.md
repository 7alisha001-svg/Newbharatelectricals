# Plan: Fix Google Sheets Integration

## Current State
- Admin Google login uses `supabase.auth.linkIdentity()` in `src/lib/googleSheetsAuth.ts`
- Error: "Manual linking is disabled" — caused by Supabase dashboard setting, not code
- Automatic inquiry sync in `/api/inquiries/submit` calls `syncRowToSheets()` **without** an access token
- `syncRowToSheets()` requires either `appScriptUrl` OR `accessToken` + `spreadsheetId`
- Frontend form components (`Contact.tsx`, `ProductEnquiryModal.tsx`, `LeadCapturePopup.tsx`) already use `rpc('create_inquiry')` and pass `id` to `/api/inquiries/submit`
- Email handling via `sendFormEmails()` is already implemented in `server.ts`
- `updateSyncStatus()` exists with fallback for missing `sheets_sync_status` columns

## Root Causes
1. **Google login error**: `linkIdentity` requires manual linking enabled in Supabase Dashboard → Authentication → Providers → Google
2. **No automatic sync**: `/api/inquiries/submit` has no access token to pass to `syncRowToSheets()`

## Required Changes

### 1. Supabase Dashboard (manual user action)
Enable **"Allow manual linking"** for the Google provider in Supabase Dashboard → Authentication → Providers → Google.
- This is the correct Supabase configuration for `linkIdentity`
- `linkIdentity` is the official Supabase API for linking OAuth providers to existing accounts — it is not "fake" or a workaround

### 2. Store Google access token server-side
**File:** `server.ts`
- When admin connects Google, frontend already gets `accessToken` from `googleSheetsAuth.ts`
- Add a new route `POST /api/settings/google-token` that stores the token in `settings.social_links.google_access_token`
- Frontend calls this after successful Google login

### 3. Pass stored token to `syncRowToSheets`
**File:** `server.ts` — `/api/inquiries/submit` and `/api/orders/submit`
- Read `socialLinks.google_access_token` from settings
- Pass it to `syncRowToSheets()` as the `accessToken` parameter
- This enables automatic sync without requiring the customer's browser to have the admin's token

### 4. Fix TypeScript types in `googleSheetsAuth.ts`
- Remove unnecessary `as any` casts
- Properly type the `id` parameter for `unlinkIdentity`
- The Supabase `unlinkIdentity` signature requires `{ provider: string; id: string }`

### 5. Verify
- `npx tsc --noEmit` passes
- `npm run build` passes
- `grep -r "firebase" src/` returns zero matches
- `/api/inquiries/submit` passes `accessToken` to `syncRowToSheets`
- Google Sheets receives inquiry data automatically
- Admin receives email, customer receives thank-you email

## Files Modified
| File | Change |
|---|---|
| `src/lib/googleSheetsAuth.ts` | Fix TypeScript types for `unlinkIdentity` |
| `server.ts` | Add `/api/settings/google-token` route; read stored token in `/api/inquiries/submit` and `/api/orders/submit`; pass token to `syncRowToSheets` |
| `src/pages/admin/GoogleSheetsPage.tsx` | After `connectGoogleAccount`, call `/api/settings/google-token` to persist the access token |

## Manual Supabase Configuration Required
1. **Supabase Dashboard → Authentication → Providers → Google**: Enable Google provider AND enable **"Allow manual linking"**
2. **Supabase Dashboard → Authentication → URL Configuration**: Add `http://localhost:3000` and production domain
3. **Google Cloud Console**: Add authorized JavaScript origins and redirect URI for the Supabase-linked OAuth client
