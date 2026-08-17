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
    /*
     * Listen for the Supabase auth event BEFORE starting OAuth.
     *
     * This avoids reading popup.location / popup.closed, which can be
     * blocked by the browser's Cross-Origin-Opener-Policy.
     */
    const authResult = await new Promise<{
      session: any;
      user: User;
      googleIdentity: GoogleIdentity;
    }>((resolve, reject) => {
      let finished = false;

      const cleanup = () => {
        clearTimeout(timeout);

        if (authSubscription) {
          authSubscription.unsubscribe();
        }

        if (!popup.closed) {
          popup.close();
        }
      };

      const finish = (
        result: {
          session: any;
          user: User;
          googleIdentity: GoogleIdentity;
        }
      ) => {
        if (finished) return;

        finished = true;
        cleanup();
        resolve(result);
      };

      const fail = (error: Error) => {
        if (finished) return;

        finished = true;
        cleanup();
        reject(error);
      };

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (finished || !session?.user) {
            return;
          }

          const user = session.user;

          /*
           * The Google OAuth access token comes from
           * session.provider_token.
           */
          const accessToken = session.provider_token;

          /*
           * The linked Google identity comes from user.identities.
           */
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
            return;
          }

          if (!accessToken) {
            console.warn(
              '[Google Sheets Auth] Google account linked, but no provider token is available yet.'
            );
            return;
          }

          const googleIdentity: GoogleIdentity = {
            provider: 'google',
            access_token: accessToken,
            id:
              (googleIdentityRecord as any).identity_id ||
              (googleIdentityRecord as any).id,
          };

          if (!googleIdentity.id) {
            fail(
              new Error(
                'Google account linked, but the Google identity ID was not returned.'
              )
            );
            return;
          }

          finish({
            session,
            user,
            googleIdentity,
          });
        }
      );

      const authSubscription = authListener.subscription;

      const timeout = setTimeout(() => {
        fail(
          new Error(
            'Google OAuth timed out. Please complete Google authorization and try again.'
          )
        );
      }, 60000);

      /*
       * Start the actual Google OAuth linking flow.
       *
       * skipBrowserRedirect=true means Supabase returns the OAuth URL
       * instead of navigating the current page.
       */
      supabase.auth
        .linkIdentity({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            skipBrowserRedirect: true,
          },
        })
        .then(({ data, error }) => {
          if (error) {
            fail(error);
            return;
          }

          if (!data?.url) {
            fail(
              new Error('No Google OAuth URL returned from Supabase.')
            );
            return;
          }

          popup.location.href = data.url;
          popup.focus();
        })
        .catch((error) => {
          fail(error);
        });
    });

    return {
      user: authResult.user,
      googleIdentity: authResult.googleIdentity,
    };
  } catch (err: any) {
    if (!popup.closed) {
      popup.close();
    }

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

  const googleIdentity = user.identities?.find(
    (identity) => identity.provider === 'google'
  );

  if (!googleIdentity) {
    return;
  }

  const identityId =
    (googleIdentity as any).identity_id ||
    (googleIdentity as any).id;

  if (!identityId) {
    return;
  }

  const { error } = await supabase.auth.unlinkIdentity({
    provider: 'google',
    id: identityId,
  } as any);

  if (error) {
    throw error;
  }
}