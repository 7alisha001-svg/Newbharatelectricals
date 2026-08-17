import { User, SupabaseClient } from '@supabase/supabase-js';

export interface GoogleIdentity {
  provider: string;
  access_token: string;
  expires_in?: number;
  token_type?: string;
  id: string;
}

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

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    const session = sessionData.session;
    const user = session?.user;

    if (!session || !user) {
      throw new Error('No active Supabase session found after Google OAuth.');
    }

    // The Google OAuth access token is provided by Supabase
    // on the session as provider_token.
    const accessToken = session.provider_token;

    // The Google identity itself is stored in user.identities.
    const googleIdentityRecord = user.identities?.find(
      (identity) => identity.provider === 'google'
    );

    console.log(
      '[Google Sheets Auth] Google identity:',
      googleIdentityRecord ? 'found' : 'not found'
    );

    console.log(
      '[Google Sheets Auth] Token source:',
      accessToken ? 'session.provider_token' : 'not available'
    );

    if (!googleIdentityRecord) {
      console.warn(
        '[Google Sheets Auth] Google identity was not found in user.identities.'
      );

      return {
        user,
        googleIdentity: null,
      };
    }

    if (!accessToken) {
      console.warn(
        '[Google Sheets Auth] Google provider access token is not available in session.provider_token.'
      );

      return {
        user,
        googleIdentity: null,
      };
    }

    const googleIdentity: GoogleIdentity = {
      provider: 'google',
      access_token: accessToken,
      id: googleIdentityRecord.identity_id,
    };

    return {
      user,
      googleIdentity,
    };
  } catch (err: any) {
    popup.close();
    throw err;
  }
}

export async function disconnectGoogleAccount(
  supabase: SupabaseClient
): Promise<void> {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const user = sessionData.session?.user;

  if (!user) {
    return;
  }

  // Identity records are stored directly on user.identities.
  const googleIdentity = user.identities?.find(
    (identity) => identity.provider === 'google'
  );

  if (!googleIdentity?.identity_id) {
    return;
  }

  const { error } = await supabase.auth.unlinkIdentity({
    provider: 'google',
    id: googleIdentity.identity_id,
  } as any);

  if (error) {
    throw error;
  }
}

function waitForPopupReturn(popup: Window): Promise<void> {
  return new Promise((resolve) => {
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
        // Cross-origin access error during OAuth flow is expected.
      }
    }, 500);
  });
}