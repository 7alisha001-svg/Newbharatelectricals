# Implementation Plan: Supabase Google OAuth + Auto Inquiry Sync

## Current State
- Admin login: Supabase email/password via `AdminLogin.tsx`
- Google Sheets auth: Firebase Google OAuth via `src/lib/googleAuth.ts` + `firebase-applet-config.json`
- Google Sheets sync: server-side `syncRowToSheets()` in `server.ts` (supports Apps Script + direct Sheets API)
- Inquiry submission: frontend inserts into Supabase `inquiries` without `.select()`, so `id` is unavailable → Google Sheets sync is skipped in `/api/inquiries/submit`
- `/api/sheets/sync-pending` exists but is not used for automatic inquiry sync

## Goal
1. Replace Firebase Google auth with Supabase Google OAuth for Google Sheets access
2. Automatically sync new inquiries to Google Sheets
3. Preserve existing Google Sheets import/export UI and functionality
4. Keep RLS enabled; no service_role or private credentials in frontend

---

## Step 1 — Database: Add `create_inquiry` function

**File to modify:** `supabase-setup.sql` (new migration/section)

**Change:**
```sql
CREATE OR REPLACE FUNCTION public.create_inquiry(
  p_name text,
  p_phone text,
  p_inquiry_type text,
  p_message text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.inquiries (name, phone, inquiry_type, message)
  VALUES (p_name, p_phone, p_inquiry_type, p_message)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_inquiry(text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.create_inquiry(text, text, text, text) TO authenticated;
```

**Why:** Frontend needs the inserted row `id` for Google Sheets sync status tracking, but `.select()` after `.insert()` fails RLS because `anon` has no SELECT policy. A `SECURITY DEFINER` function inserts the row server-side and returns the `id` directly, avoiding the need for frontend SELECT permission.

**Security:** Function only inserts into `public.inquiries` with fixed columns. No arbitrary table access. `anon` gets only `EXECUTE` on this function.

---

## Step 2 — Frontend: Replace inquiry insert with RPC call

**Files to modify:**
- `src/pages/Contact.tsx`
- `src/components/ProductEnquiryModal.tsx`
- `src/components/LeadCapturePopup.tsx`

**Change in each file:**
Replace:
```typescript
const { error: dbError } = await supabaseAnon
  .from('inquiries')
  .insert([{ name, phone, inquiry_type: inquiryType, message: JSON.stringify(payloadData) }]);
```

With:
```typescript
const { data: inquiryId, error: dbError } = await supabaseAnon
  .rpc('create_inquiry', {
    p_name: name,
    p_phone: phone,
    p_inquiry_type: inquiryType,
    p_message: JSON.stringify(payloadData)
  });
```

Then pass `inquiryId` to `/api/inquiries/submit` as `id`.

**Why:** This gives the server the inquiry `id` so it can sync to Google Sheets and update sync status.

---

## Step 3 — Frontend: Replace Firebase Google auth with Supabase Google OAuth

**Files to modify:**
- Delete `src/lib/googleAuth.ts`
- Delete `firebase-applet-config.json`
- Modify `src/pages/admin/GoogleSheetsPage.tsx`

**Create:** `src/lib/googleSheetsAuth.ts`

**New `googleSheetsAuth.ts` responsibilities:**
- Export `connectGoogleAccount(supabase)` — calls `supabase.auth.linkIdentity({ provider: 'google' })`, opens the returned URL in a popup, waits for popup close, then reads the Google access token from the updated session via `supabase.auth.getSession()`
- Export `disconnectGoogleAccount(supabase)` — calls `supabase.auth.unlinkIdentity({ provider: 'google' })`
- Export `getStoredAccessToken()` — reads token from `sessionStorage` (optional, for persistence)

**Popup flow:**
1. Call `supabase.auth.linkIdentity({ provider: 'google' })` → get `url`
2. Open `url` in a centered popup (`width=500, height=600`)
3. Poll `popup.closed` every 500ms
4. When closed, call `supabase.auth.getSession()` and extract `user.user_metadata.identities` where `provider === 'google'`
5. Return the `access_token`

**Update `GoogleSheetsPage.tsx`:**
- Remove all Firebase imports (`googleAuth.ts`, `firebase/auth`, `FirebaseUser`)
- Replace `user` state type from `FirebaseUser` to Supabase `User`
- Replace `handleGoogleLogin` to use new `connectGoogleAccount(supabase)`
- Replace `handleGoogleLogout` to use new `disconnectGoogleAccount(supabase)`
- Replace `initAuth` usage with standard `supabase.auth.getSession()` + `supabase.auth.onAuthStateChange()`
- Extract Google access token from `session.user.user_metadata.identities`

**Why:** Eliminates Firebase dependency and uses the existing Supabase admin session. `linkIdentity` links Google to the already-authenticated admin account without replacing the admin session.

---

## Step 4 — Server: Ensure `/api/inquiries/submit` syncs inquiries automatically

**File to modify:** `server.ts`

**Change in `/api/inquiries/submit`:**
Currently:
```typescript
if (id) {
  try {
    await syncRowToSheets("inquiry", { ... });
    await updateSyncStatus("inquiries", id, "synced");
  } catch (sheetsErr) {
    await updateSyncStatus("inquiries", id, "pending", sheetsErr.message);
  }
}
```

After Step 2, `id` will always be present for successful inserts. Keep the existing logic but ensure it runs whenever `id` is provided. No structural change needed here — the fix is in the frontend passing `id`.

**Also in `/api/orders/submit`:**
Keep existing logic (orders already pass `id` via `.select()`).

---

## Step 5 — Server: Add `/api/sheets/sync-pending` endpoint

**Status:** Already implemented in previous session. Keep as retry/backup mechanism.

---

## Step 6 — Cleanup Firebase

**Files to delete:**
- `src/lib/googleAuth.ts`
- `firebase-applet-config.json`

**Files to modify:**
- `package.json` — remove `"firebase": "^12.15.0"` from dependencies (only if no other code uses Firebase)
- `src/pages/admin/GoogleSheetsPage.tsx` — remove Firebase import and `FirebaseUser` type

**Verify:** Run `grep -r "firebase" src/` after changes to confirm zero references.

---

## Step 7 — Verification

1. `npx tsc --noEmit` — must pass
2. `npm run build` — must pass
3. Grep for `firebase` in `src/` — must return zero matches
4. Grep for `googleAuth` — must return zero matches
5. Verify `supabase-setup.sql` contains the new `create_inquiry` function
6. Verify `Contact.tsx`, `ProductEnquiryModal.tsx`, `LeadCapturePopup.tsx` all use `rpc('create_inquiry', ...)`
7. Verify `GoogleSheetsPage.tsx` uses Supabase `linkIdentity` instead of Firebase

---

## Manual Supabase/Google Console Configuration Required

### Supabase Dashboard
1. **Authentication → Providers → Google:** Enable Google provider
2. **Authentication → URL Configuration:** Add `http://localhost:3000` (dev) and production domain to allowed redirect URLs

### Google Cloud Console (for OAuth client used by Supabase)
1. In Supabase Dashboard → Authentication → Providers → Google, note the linked Google Cloud project
2. In that Google Cloud project → APIs & Services → Credentials → OAuth 2.0 Client
3. Add authorized JavaScript origins:
   - `http://localhost:3000` (dev)
   - `https://newbharatelectricals.com` (production)
4. Add authorized redirect URIs:
   - `https://<supabase-project>.supabase.co/auth/v1/callback`

---

## Risks & Edge Cases

| Risk | Mitigation |
|---|---|
| Popup blocked by browser | Fallback: if `window.open` returns null, redirect `window.location.href` to the `linkIdentity` URL |
| Admin has no Google identity yet | UI shows "Connect Google Account" button; after linking, token appears |
| Google Sheets sync fails | Inquiry stays in DB with `sheets_sync_status = 'pending'`; retry via "Sync Pending" button |
| Duplicate Sheets rows | `syncRowToSheets` uses `append` (not upsert); idempotency relies on sync status tracking, not Sheets-side dedup |
| `create_inquiry` function injection | Function uses fixed column list; no dynamic SQL; parameters are typed |

---

## Files Changed Summary

| File | Action |
|---|---|
| `supabase-setup.sql` | Add `create_inquiry` function + grants |
| `src/pages/Contact.tsx` | Use `rpc('create_inquiry')` instead of `.insert()` |
| `src/components/ProductEnquiryModal.tsx` | Use `rpc('create_inquiry')` instead of `.insert()` |
| `src/components/LeadCapturePopup.tsx` | Use `rpc('create_inquiry')` instead of `.insert()` |
| `src/pages/admin/GoogleSheetsPage.tsx` | Replace Firebase auth with Supabase Google OAuth |
| `src/lib/googleSheetsAuth.ts` | **Create** — Supabase-based Google OAuth helper |
| `src/lib/googleAuth.ts` | **Delete** |
| `firebase-applet-config.json` | **Delete** |
| `package.json` | Remove `firebase` dependency |
| `server.ts` | No changes needed (already has sync + pending endpoint) |
