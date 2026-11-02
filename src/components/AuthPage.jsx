import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import GoogleAuthButton from './GoogleAuthButton';

export default function AuthPage({
  initialMode = 'login',
  authNotice = '',
  onLoginSuccess,
  onRegisterSuccess,
  onBack,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
    setShowForgotNotice(false);
  }, [initialMode]);

  // Demo Credentials Auto Fill
  const handleFillDemo = (type = 'customer') => {
    if (type === 'admin') {
      setLoginEmail('admin@whitemist.com');
      setLoginPassword('Password123!');
    } else {
      setLoginEmail('customer@example.com');
      setLoginPassword('Password123!');
    }
    setErrorMessage('');
    setShowForgotNotice(false);
  };

  // Password strength calculation for Sign Up
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#CBD5E1' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: '#EF4444' };
    if (score === 2) return { score: 50, label: 'Fair', color: '#F59E0B' };
    if (score === 3) return { score: 75, label: 'Good', color: '#0084FF' };
    return { score: 100, label: 'Strong', color: '#16A34A' };
  };

  const passwordStrength = getPasswordStrength(regPassword);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setShowForgotNotice(false);

    const emailTrim = loginEmail.trim();
    if (!emailTrim || !loginPassword) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    if (!validateEmail(emailTrim)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.login({
        email: emailTrim,
        password: loginPassword,
      });

      setSuccessMessage(`Welcome back, ${data.user.full_name || 'Customer'}. Logging you in...`);
      setLoading(false);

      if (rememberMe) {
        localStorage.setItem('wm_remember_email', emailTrim);
      } else {
        localStorage.removeItem('wm_remember_email');
      }

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(data.user, data.tokens?.accessToken || 'mock_token');
        }
      }, 700);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Invalid email or password credentials. Please verify your details.');
    }
  };

  // Register handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const nameTrim = regName.trim();
    const emailTrim = regEmail.trim();

    if (!nameTrim) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!emailTrim || !validateEmail(emailTrim)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!termsAgreed) {
      setErrorMessage('Please agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.register({
        full_name: nameTrim,
        email: emailTrim,
        password: regPassword,
        phone: regPhone.trim() || undefined,
      });

      setSuccessMessage('Account created successfully. Logging you in...');
      setLoading(false);

      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(data.user, data.tokens?.accessToken || 'mock_token');
        }
      }, 800);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Registration failed. An account with this email may already exist.');
    }
  };

  // Google Authentication handler
  const handleGoogleAuthSelect = async (accountData) => {
    setErrorMessage('');
    setSuccessMessage('');
    setShowForgotNotice(false);
    setLoading(true);
    try {
      const data = await api.googleAuth({
        email: accountData.email,
        full_name: accountData.full_name,
        avatar_url: accountData.avatar_url,
      });

      setSuccessMessage(`Google Authentication Successful! Welcome, ${data.user.full_name || 'Customer'}.`);
      setLoading(false);

      setTimeout(() => {
        if (mode === 'register' && onRegisterSuccess) {
          onRegisterSuccess(data.user, data.tokens?.accessToken || 'mock_token');
        } else if (onLoginSuccess) {
          onLoginSuccess(data.user, data.tokens?.accessToken || 'mock_token');
        }
      }, 700);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Google authentication failed. Please try again.');
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem('wm_remember_email');
    if (remembered) {
      setLoginEmail(remembered);
    }
  }, []);

  return (
    <div
      className="auth-full-page"
      style={{
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        background: '#FFFFFF'
      }}
    >
      {/* ========================================================= */}
      {/* LEFT COLUMN: LIGHT THEME DESIGN WITH WHITE FABRIC TEXTURE */}
      {/* ========================================================= */}
      <div
        className="auth-full-page-left"
        style={{
          position: 'relative',
          backgroundImage: "url('/assets/images/fabric_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRight: 'none',
          padding: '4rem 4rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Slim edge transition at the very boundary - never reaching or overlapping text */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '28px',
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 60%, #FFFFFF 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        {/* Top Brand Header */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <img
              src="/assets/images/logo.png"
              alt="White Mist"
              style={{ height: '46px', objectFit: 'contain' }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '800',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#475569'
              }}
            >
              Premium Fabric Care
            </span>
          </div>

          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1E1B4B',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              marginBottom: '1rem'
            }}
          >
            Pure Cleanliness, <br />
            <span style={{ color: 'var(--color-purple-primary)' }}>
              Infinite Freshness.
            </span>
          </h2>
        </div>

        {/* Small Text Area with 100% Transparent Blur (No White Paint/Fog, No Fade on Right) */}
        <div style={{ position: 'relative', margin: '1.25rem 0', maxWidth: '430px' }}>
          {/* Pure Transparent Backdrop Blur (No white milky color) */}
          <div
            style={{
              position: 'absolute',
              top: '-1.25rem',
              left: '-1.5rem',
              right: '-1.5rem',
              bottom: '-1.25rem',
              background: 'transparent',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              WebkitMaskImage: 'radial-gradient(ellipse at 45% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.75) 25%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.12) 75%, rgba(0, 0, 0, 0) 100%)',
              maskImage: 'radial-gradient(ellipse at 45% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.75) 25%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.12) 75%, rgba(0, 0, 0, 0) 100%)',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Paragraph */}
            <p
              style={{
                color: '#1E293B',
                fontSize: '0.98rem',
                lineHeight: 1.65,
                margin: 0,
                fontWeight: '500'
              }}
            >
              Advanced bio-enzyme laundry formulations engineered to preserve fine fabric fibers, lift deep stains effortlessly, and sustain long-lasting fragrance.
            </p>

            {/* Feature Points Below Paragraph (Words only, no divisions or boxes) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    color: 'var(--color-purple-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.3rem'
                  }}
                >
                  Triple Bio-Enzyme Action
                </div>
                <div style={{ fontSize: '0.9rem', color: '#1E293B', lineHeight: 1.55 }}>
                  Targeted natural enzyme cascades lift deep collar grime, food grease, and persistent sweat without fiber wear.
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    color: '#0284C7',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.3rem'
                  }}
                >
                  48-Hour Micro-Capsule Fragrance
                </div>
                <div style={{ fontSize: '0.9rem', color: '#1E293B', lineHeight: 1.55 }}>
                  Encapsulated fragrance technology activates gradually with movement, ensuring clothes stay crisp and fresh.
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    color: '#059669',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.3rem'
                  }}
                >
                  Member Priority Service
                </div>
                <div style={{ fontSize: '0.9rem', color: '#1E293B', lineHeight: 1.55 }}>
                  Complimentary express shipping across India on Super Saver subscriptions, automated refills, and quotes.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Clean Trust Metric & Guarantee (Borderless, position above shade) */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            borderTop: 'none',
            paddingTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#475569',
            fontWeight: '500'
          }}
        >
          <span>Rated 4.9 / 5 across 2,800+ homes</span>
          <span>Quality Guaranteed</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM (FULL-PAGE, CLEAN)      */}
      {/* ========================================================= */}
      <div
        className="auth-full-page-right"
        style={{
          background: '#FFFFFF',
          padding: '3.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%' }}>
          {/* Top Return to Store Link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}
          >
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: '600',
                padding: '0.35rem 0',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-purple-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              Return to store
            </button>

            <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: '500' }}>
              256-bit encrypted
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              background: '#F1F5F9',
              padding: '4px',
              borderRadius: '999px',
              marginBottom: '1.75rem'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '999px',
                border: 'none',
                background: mode === 'login' ? '#FFFFFF' : 'transparent',
                color: mode === 'login' ? 'var(--color-purple-primary)' : '#64748B',
                fontWeight: mode === 'login' ? '700' : '500',
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: mode === 'login' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'var(--transition)'
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '999px',
                border: 'none',
                background: mode === 'register' ? '#FFFFFF' : 'transparent',
                color: mode === 'register' ? 'var(--color-purple-primary)' : '#64748B',
                fontWeight: mode === 'register' ? '700' : '500',
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'var(--transition)'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Header Titles */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                marginBottom: '0.35rem'
              }}
            >
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.5 }}>
              {mode === 'login'
                ? 'Enter your registered credentials to access your account'
                : 'Join White Mist for personalized dosage calculations and orders'}
            </p>
          </div>

          {/* Contextual Notice Banner (e.g. from Buy Now) */}
          {authNotice && (
            <div
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '0.85rem 1.1rem',
                marginBottom: '1.25rem',
                fontSize: '0.88rem',
                color: '#1E40AF',
                fontWeight: '500',
                lineHeight: 1.45
              }}
            >
              {authNotice}
            </div>
          )}

          {/* Demo Quick-Fill Box */}
          {mode === 'login' && (
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: '500' }}>
                Test Account
              </span>
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                style={{
                  background: 'var(--color-purple-primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.38rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                title="Fills customer@example.com / Password123!"
              >
                1-Click Auto Fill
              </button>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                lineHeight: 1.45,
                animation: 'shake 0.3s ease'
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Forgot Password Notice Helper */}
          {showForgotNotice && (
            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                color: '#92400E',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.25rem',
                fontSize: '0.84rem',
                lineHeight: 1.45
              }}
            >
              Password reset link will be sent to your email. In test mode, you can use: <strong>Password123!</strong>
            </div>
          )}

          {/* Google Authentication Button (Separate for Sign In and Sign Up) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <GoogleAuthButton
              mode={mode}
              onSelectAccount={handleGoogleAuthSelect}
              loading={loading}
              customLabel={mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}
            />

            {/* OR Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '1.25rem 0 0.5rem 0',
                gap: '0.85rem'
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#94A3B8',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                or continue with email
              </span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>
          </div>

          {/* ========================================================= */}
          {/* FORM: SIGN IN                                             */}
          {/* ========================================================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Email Address */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    marginBottom: '0.45rem'
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-purple-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 27, 133, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1';
                    e.target.style.boxShadow = 'none';
                  }}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(!showForgotNotice)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-purple-primary)',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 4rem 0.75rem 0.95rem',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      background: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-purple-primary)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(63, 27, 133, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#CBD5E1';
                      e.target.style.boxShadow = 'none';
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748B',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      padding: '0.2rem 0.4rem'
                    }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-purple-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '0.82rem', color: '#64748B', cursor: 'pointer', userSelect: 'none' }}>
                  Remember me on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  borderRadius: '8px',
                  marginTop: '0.4rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* ========================================================= */
            /* FORM: SIGN UP                                             */
            /* ========================================================= */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Full Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    marginBottom: '0.45rem'
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Verma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-purple-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 27, 133, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1';
                    e.target.style.boxShadow = 'none';
                  }}
                  autoComplete="name"
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    marginBottom: '0.45rem'
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-purple-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 27, 133, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1';
                    e.target.style.boxShadow = 'none';
                  }}
                  autoComplete="email"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    marginBottom: '0.45rem'
                  }}
                >
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.95rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-purple-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 27, 133, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1';
                    e.target.style.boxShadow = 'none';
                  }}
                  autoComplete="tel"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    marginBottom: '0.45rem'
                  }}
                >
                  Create Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 4rem 0.75rem 0.95rem',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      background: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-purple-primary)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(63, 27, 133, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#CBD5E1';
                      e.target.style.boxShadow = 'none';
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748B',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      padding: '0.2rem 0.4rem'
                    }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {regPassword.length > 0 && (
                  <div style={{ marginTop: '0.45rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Password strength</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${passwordStrength.score}%`,
                          height: '100%',
                          background: passwordStrength.color,
                          transition: 'width 0.3s ease, background-color 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Agreement */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.2rem' }}>
                <input
                  type="checkbox"
                  id="termsAgreed"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  style={{ accentColor: 'var(--color-purple-primary)', width: '16px', height: '16px', cursor: 'pointer', marginTop: '2px' }}
                />
                <label htmlFor="termsAgreed" style={{ fontSize: '0.8rem', color: '#64748B', cursor: 'pointer', lineHeight: 1.4 }}>
                  I agree to the White Mist Terms of Service and Privacy Policy.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  borderRadius: '8px',
                  marginTop: '0.4rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1
                }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Bottom Switcher */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #F1F5F9',
              textAlign: 'center',
              fontSize: '0.86rem',
              color: '#64748B'
            }}
          >
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-purple-primary)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.86rem'
                  }}
                >
                  Create Account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-purple-primary)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.86rem'
                  }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
