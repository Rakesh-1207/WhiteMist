import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ExternalLink, AlertCircle, CheckCircle2, ShieldCheck, Loader2, Key } from 'lucide-react';

/**
 * Official Google 4-Color Vector Logo
 */
export function GoogleLogo({ size = 20, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

/**
 * Decode standard Google JWT credential token
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Real Google OAuth Authentication Button (Google Identity Services)
 */
export default function GoogleAuthButton({
  mode = 'login', // 'login' | 'register'
  onSelectAccount,
  loading: externalLoading = false,
  customLabel,
  style = {},
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputClientId, setInputClientId] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const googleBtnContainerRef = useRef(null);

  const label =
    customLabel ||
    (mode === 'register' ? 'Sign up with Google' : 'Sign in with Google');

  const isLoading = externalLoading || internalLoading;

  // Retrieve configured Google Client ID from Vite env or localStorage
  const getGoogleClientId = () => {
    return (
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem('wm_google_client_id') ||
      ''
    ).trim();
  };

  // Ensure Google Identity Services SDK script is loaded
  const ensureGoogleScriptLoaded = () => {
    return new Promise((resolve) => {
      if (window.google?.accounts?.id && window.google?.accounts?.oauth2) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        setTimeout(() => resolve(!!window.google?.accounts), 1500);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  };

  // Handle Google ID Token (from Google One Tap or ID Token popup)
  const handleGoogleCredentialResponse = useCallback(async (response) => {
    if (!response?.credential) {
      setAuthError('Google sign-in was interrupted. Please try again.');
      setInternalLoading(false);
      return;
    }

    try {
      setInternalLoading(true);
      setAuthError('');
      const decoded = parseJwt(response.credential);
      if (!decoded || !decoded.email) {
        throw new Error('Could not parse Google ID token credential');
      }

      if (onSelectAccount) {
        await onSelectAccount({
          email: decoded.email,
          full_name: decoded.name || decoded.given_name || decoded.email.split('@')[0],
          avatar_url: decoded.picture || null,
          google_id: decoded.sub,
          auth_provider: 'google',
          id_token: response.credential,
        });
      }
    } catch (err) {
      setAuthError(err.message || 'Google account verification failed. Please try again.');
    } finally {
      setInternalLoading(false);
    }
  }, [onSelectAccount]);

  // Initialize GIS and render real Google button if Client ID exists
  useEffect(() => {
    const clientId = getGoogleClientId();
    if (!clientId) return;

    let isMounted = true;
    ensureGoogleScriptLoaded().then((loaded) => {
      if (!isMounted || !loaded || !window.google?.accounts?.id) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Optional: Render native Google button in container if present
        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: mode === 'register' ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: '100%',
          });
        }
      } catch (err) {
        console.warn('Google Identity Services initialization notice:', err);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [mode, handleGoogleCredentialResponse]);

  // Trigger real Google OAuth popup flow
  const handleRealGoogleClick = async () => {
    setAuthError('');
    const clientId = getGoogleClientId();

    if (!clientId) {
      // Prompt user to provide or configure their Google Client ID
      setShowConfigModal(true);
      return;
    }

    setInternalLoading(true);
    const loaded = await ensureGoogleScriptLoaded();

    if (!loaded || !window.google?.accounts?.oauth2) {
      setInternalLoading(false);
      setAuthError('Unable to load Google Identity Services. Check your internet connection.');
      return;
    }

    try {
      // Real Google OAuth 2.0 Token Client: opens official Google permissions popup directly
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            setInternalLoading(false);
            if (tokenResponse.error !== 'popup_closed_by_user') {
              setAuthError(`Google authentication notice: ${tokenResponse.error_description || tokenResponse.error}`);
            }
            return;
          }

          // Fetch REAL verified user profile from Google's official userinfo API
          try {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });

            if (!userInfoRes.ok) {
              throw new Error('Google Userinfo endpoint returned an error');
            }

            const googleProfile = await userInfoRes.json();

            if (!googleProfile.email) {
              throw new Error('No email returned from authorized Google account');
            }

            if (onSelectAccount) {
              await onSelectAccount({
                email: googleProfile.email,
                full_name: googleProfile.name || googleProfile.given_name || googleProfile.email.split('@')[0],
                avatar_url: googleProfile.picture || null,
                google_id: googleProfile.sub,
                auth_provider: 'google',
                access_token: tokenResponse.access_token,
              });
            }
          } catch (err) {
            setAuthError(err.message || 'Failed to fetch verified Google profile data.');
          } finally {
            setInternalLoading(false);
          }
        },
        error_callback: (err) => {
          setInternalLoading(false);
          setAuthError(`Google OAuth popup notice: ${err.message || 'OAuth error'}`);
        },
      });

      // Request real Google access token via official Google accounts popup
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      setInternalLoading(false);
      setAuthError(err.message || 'Could not launch Google authentication window.');
    }
  };

  // Save Client ID entered by user and immediately launch Google Sign-in
  const handleSaveClientId = (e) => {
    e.preventDefault();
    const trimmed = inputClientId.trim();
    if (!trimmed) return;

    localStorage.setItem('wm_google_client_id', trimmed);
    setShowConfigModal(false);
    setInputClientId('');

    // Re-initialize and trigger real Google OAuth popup
    setTimeout(() => {
      handleRealGoogleClick();
    }, 200);
  };

  return (
    <>
      {/* Real Google Login Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={handleRealGoogleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          width: '100%',
          minHeight: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          backgroundColor: isHovered ? '#F8FAFC' : '#FFFFFF',
          border: isHovered ? '1.5px solid #94A3B8' : '1.5px solid #CBD5E1',
          borderRadius: '8px',
          padding: '0.65rem 1.25rem',
          color: '#1E293B',
          fontSize: '0.92rem',
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: isHovered
            ? '0 2px 8px rgba(0, 0, 0, 0.08)'
            : '0 1px 3px rgba(0, 0, 0, 0.03)',
          transform: isPressed ? 'scale(0.99)' : 'none',
          transition: 'all 0.18s ease',
          outline: 'none',
          userSelect: 'none',
          boxSizing: 'border-box',
          ...style,
        }}
        aria-label={label}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="spin-icon" style={{ color: '#4285F4' }} />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <GoogleLogo size={20} />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Error message banner if Google OAuth reports an issue */}
      {authError && (
        <div
          style={{
            marginTop: '0.6rem',
            padding: '0.55rem 0.85rem',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            color: '#B91C1C',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            lineHeight: 1.4,
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{authError}</span>
        </div>
      )}

      {/* Google Cloud Client ID Configuration Modal (when Client ID is not yet provided) */}
      {showConfigModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setShowConfigModal(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '2rem 1.75rem 1.5rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              animation: 'fadeInUp 0.25s ease',
              fontFamily: 'system-ui, -apple-system, Roboto, sans-serif',
              boxSizing: 'border-box',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#5F6368',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'inline-flex', marginBottom: '0.6rem' }}>
                <GoogleLogo size={32} />
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#202124',
                }}
              >
                Connect Real Google Authentication
              </h3>
              <p
                style={{
                  margin: '0.4rem 0 0 0',
                  fontSize: '0.86rem',
                  color: '#5F6368',
                  lineHeight: 1.45,
                }}
              >
                To access real Google accounts and permissions directly from Google, enter your <strong>Google Cloud OAuth Client ID</strong> below.
              </p>
            </div>

            {/* Client ID Entry Form */}
            <form onSubmit={handleSaveClientId} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: '#3C4043',
                    marginBottom: '0.4rem',
                  }}
                >
                  Google OAuth 2.0 Client ID
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Key size={16} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1234567890-abcdef.apps.googleusercontent.com"
                    value={inputClientId}
                    onChange={(e) => setInputClientId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#4285F4')}
                    onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#1A73E8',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1557B0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1A73E8')}
              >
                <ShieldCheck size={16} />
                <span>Save & Launch Real Google Login</span>
              </button>
            </form>

            {/* Quick 3-Step Setup Instructions */}
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#475569',
                lineHeight: 1.5,
              }}
            >
              <div style={{ fontWeight: '700', color: '#1E293B', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={14} style={{ color: '#16A34A' }} /> How to get your free Google Client ID:
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
                <li>
                  Open{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#1A73E8', fontWeight: '600', textDecoration: 'none' }}
                  >
                    Google Cloud Console <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
                  </a>
                </li>
                <li>Create <strong>OAuth Client ID</strong> &rarr; Select <strong>Web Application</strong>.</li>
                <li>Add <code>http://localhost:5173</code> to <strong>Authorized JavaScript origins</strong>.</li>
                <li>Copy the Client ID and paste it here (or in <code>.env</code> as <code>VITE_GOOGLE_CLIENT_ID</code>).</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
