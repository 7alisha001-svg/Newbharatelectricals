# Plan: Revert Latest Google Sheets Update

## Target Commit
Revert `2f0af89` ("google sheet") — the most recent Google Sheets integration commit.

## What This Reverts
- `server.ts`: removes `POST /api/settings/google-token`; stops reading `google_access_token` from settings in `/api/inquiries/submit` and `/api/orders/submit`; removes automatic token passing to `syncRowToSheets`
- `src/lib/googleSheetsAuth.ts`: restores previous TypeScript state before the `unlinkIdentity` cast fix
- `src/pages/admin/GoogleSheetsPage.tsx`: removes the `/api/settings/google-token` persistence calls in `handleGoogleLogin` and `handleGoogleLogout`
- `.kilo/plans/1786731242600-fix-google-sheets-sync.md`: removes this plan file

## What Is Preserved
- `ffbd54e` ("google sheet auth improve") and earlier commits remain intact
- Existing Firebase removal, `create_inquiry` RPC, Supabase Google OAuth (`linkIdentity`), and email/sync status logic from prior commits are untouched

## Steps
1. `git revert 2f0af89`
2. Resolve any merge conflicts if they arise
3. `npx tsc --noEmit`
4. `npm run build`
5. Confirm reverted files with `git show --stat HEAD`

## Notes
- This uses `git revert` (safe, creates a new undo commit) rather than `git reset --hard`
- No source redesign, UI changes, or config changes are introduced — only removal of the latest commit's additions
