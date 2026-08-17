# Fix: Google OAuth Popup Blocking

## Root Cause

`connectGoogleAccount()` calls `supabase.auth.linkIdentity()` and THEN opens the popup:

```ts
const { data, error } = await supabase.auth.linkIdentity({ provider: 'google' });
// ... after await ...
await openPopupAndWait(data.url);
```

Because `window.open()` runs **after** an `await`, Chrome treats the popup as non-user-initiated and blocks it.

Additionally, `linkIdentity` without `skipBrowserRedirect: true` causes the **main window** to redirect to the OAuth URL, which is why the admin panel is replaced.

## Fix

**File:** `src/lib/googleSheetsAuth.ts`

### Change 1: `connectGoogleAccount`

Open the popup **synchronously** before the async call, then navigate it to the OAuth URL once Supabase returns it. Pass `options.redirectTo` and `options.skipBrowserRedirect: true` to prevent main-window redirect and ensure the popup returns to the current origin.

```ts
export async function connectGoogleAccount(
  supabase: SupabaseClient
): Promise<{ user: User; googleIdentity: GoogleIdentity | null }> {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    'about:blank',
    'google-oauth',
    `width=${width},height=${height},left=${left},top=${top}`
  );

  if (!popup) {
    throw new Error('Popup blocked. Please allow popups for this site.');
  }

  try {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      popup.close();
      throw error;
    }

    if (!data?.url) {
      popup.close();
      throw new Error('No Google OAuth URL returned from Supabase.');
    }

    popup.location.href = data.url;

    await waitForPopupReturn(popup);

    const { data: sessionData } = await supabase.auth.getSession();
    const identities = sessionData.session?.user?.user_metadata?.identities || {};
    const googleIdentity = Object.values(identities).find(
      (id: any) => id?.provider === 'google'
    ) as GoogleIdentity | undefined;

    return {
      user: sessionData.session?.user as User,
      googleIdentity: googleIdentity || null,
    };
  } catch (err: any) {
    popup.close();
    throw err;
  }
}
```

### Change 2: Replace `openPopupAndWait` with `waitForPopupReturn`

```ts
function waitForPopupReturn(popup: Window): Promise<void> {
  return new Promise((resolve, reject) => {
    const expectedOrigin = window.location.origin;
    let resolved = false;

    const poll = setInterval(() => {
      if (resolved) return;

      if (popup.closed) {
        clearInterval(poll);
        resolved = true;
        resolve();
        return;
      }

      try {
        const popupOrigin = new URL(popup.location.href).origin;
        if (popupOrigin === expectedOrigin) {
          clearInterval(poll);
          resolved = true;
          setTimeout(() => {
            popup.close();
            resolve();
          }, 300);
        }
      } catch (e) {
        // Cross-origin access error during OAuth flow is expected and safe to ignore
      }
    }, 500);
  });
}
```

### Change 3: `disconnectGoogleAccount`

No change needed for the popup fix. Keep existing code.

## How This Avoids Chrome's Popup Blocker

1. `window.open('about:blank', ...)` runs **synchronously** inside the user's click event handler (`handleGoogleLogin` in `GoogleSheetsPage.tsx`).
2. Because the popup is opened before any `await`, Chrome treats it as user-initiated and allows it.
3. The async `linkIdentity` call happens **after** the popup is already open.
4. Once Supabase returns the OAuth URL, we navigate the **already-open** popup to that URL via `popup.location.href = data.url`.
5. No second `window.open()` is needed after the async operation.

## Redirect Flow

1. Admin clicks **Sign in with Google** on `/admin/sheets`.
2. Blank popup opens synchronously (user-initiated, not blocked).
3. `linkIdentity` is called with `skipBrowserRedirect: true` — main window stays on `/admin/sheets`.
4. Popup navigates to Google OAuth URL.
5. After Google auth, popup redirects to Supabase callback.
6. Supabase redirects popup back to `window.location.origin` with `#access_token=...`.
7. `waitForPopupReturn` detects the origin match, waits 300ms, closes the popup, and resolves.
8. `GoogleSheetsPage` calls `getSession()` and finds the newly linked Google identity with the `access_token`.
9. `loadSpreadsheets(accessToken)` runs automatically via the existing `useEffect`.

## Supabase Dashboard Configuration

Add these under **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**:

- `http://localhost:3000`
- `https://newbharatelectricals.com`

Also confirm under **Authentication → Providers → Google**:
- Google provider is enabled
- **Allow manual linking** is enabled (required for `linkIdentity`)

## Files Changed

| File | Change |
|---|---|
| `src/lib/googleSheetsAuth.ts` | Open popup synchronously before `linkIdentity`; add `options.redirectTo` and `skipBrowserRedirect: true`; replace `openPopupAndWait` with `waitForPopupReturn` that detects origin return |

## Verification

After applying the changes:
1. `npx tsc --noEmit` — should pass
2. `npm run build` — should pass
3. Click **Sign in with Google** in admin panel
4. Popup should open immediately (not blocked)
5. After Google auth, popup should close automatically
6. Admin panel should show **"Successfully authenticated with Google!"**
7. Spreadsheets should load automatically
