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

export async function disconnectGoogleAccount(
  supabase: SupabaseClient
): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const identities = sessionData.session?.user?.user_metadata?.identities || {};
  const googleIdentity = Object.values(identities).find(
    (id: any) => id?.provider === 'google'
  ) as GoogleIdentity | undefined;

  if (!googleIdentity?.id) {
    return;
  }

  const { error } = await supabase.auth.unlinkIdentity({
    provider: 'google',
    id: googleIdentity.id,
  } as any);

  if (error) {
    throw error;
  }
}

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
