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
  const { data, error } = await supabase.auth.linkIdentity({
    provider: 'google',
  });

  if (error) {
    throw error;
  }

  if (!data?.url) {
    throw new Error('No Google OAuth URL returned from Supabase.');
  }

  await openPopupAndWait(data.url);

  const { data: sessionData } = await supabase.auth.getSession();
  const identities = sessionData.session?.user?.user_metadata?.identities || {};
  const googleIdentity = Object.values(identities).find(
    (id: any) => id?.provider === 'google'
  ) as GoogleIdentity | undefined;

  return {
    user: sessionData.session?.user as User,
    googleIdentity: googleIdentity || null,
  };
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

  const { error } = await supabase.auth.unlinkIdentity(googleIdentity as any);

  if (error) {
    throw error;
  }
}

function openPopupAndWait(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      url,
      'google-oauth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll);
        resolve();
      }
    }, 500);
  });
}
