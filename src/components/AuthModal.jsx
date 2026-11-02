import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import GoogleAuthButton from './GoogleAuthButton';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
  onRegisterSuccess,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setLoginEmail('customer@example.com');
    setLoginPassword('Password123!');
    setErrorMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMessage('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      const data = await api.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      setSuccessMessage('Login successful! Welcome back.');
      setLoading(false);
      setTimeout(() => {
        onLoginSuccess(data.user, data.tokens?.accessToken || 'mock_token');
        onClose();
      }, 500);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Invalid email or password credentials');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Full name is required');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMessage('Valid email address is required');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await api.register({
        email: regEmail.trim(),
        password: regPassword,
        full_name: regName.trim(),
        phone: regPhone.trim() || null,
      });

      setSuccessMessage('Account created successfully! Logging you in...');
      setLoading(false);
      setTimeout(() => {
        onRegisterSuccess(data.user, data.tokens?.accessToken || 'mock_token');
        onClose();
      }, 600);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Registration failed. Email may already be registered.');
    }
  };

  const handleGoogleAuthSelect = async (accountData) => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const data = await api.googleAuth({
        email: accountData.email,
        full_name: accountData.full_name,
        avatar_url: accountData.avatar_url,
      });

      setSuccessMessage(`Welcome, ${data.user.full_name || 'Customer'}! Logging you in...`);
      setLoading(false);

      setTimeout(() => {
        if (mode === 'register' && onRegisterSuccess) {
          onRegisterSuccess(data.user, data.tokens?.accessToken || 'mock_token');
        } else if (onLoginSuccess) {
          onLoginSuccess(data.user, data.tokens?.accessToken || 'mock_token');
        }
        onClose();
      }, 500);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Google authentication failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '460px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(39, 13, 91, 0.45)',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Gradient */}
        <div
          style={{
            background: 'linear-gradient(135deg, #270D5B 0%, #3F1B85 100%)',
            color: 'white',
            padding: '2rem 2rem 1.5rem 2rem',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 184, 0, 0.2)', border: '1px solid #FFB800', borderRadius: 'var(--radius-full)', padding: '0.25rem 0.75rem', color: '#FFB800', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.6rem' }}>
            <ShieldCheck size={13} /> WHITE MIST ACCOUNT
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', margin: 0 }}>
            {mode === 'login' ? 'Welcome Back' : 'Join White Mist'}
          </h2>
          <p style={{ margin: '0.35rem 0 0 0', color: '#CBD5E1', fontSize: '0.88rem' }}>
            {mode === 'login'
              ? 'Log in to track orders, manage delivery addresses & save preferences'
              : 'Sign up to unlock member-only savings and 1-click orders'}
          </p>

          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-full)',
              padding: '4px',
              marginTop: '1.25rem',
            }}
          >
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                background: mode === 'login' ? 'white' : 'transparent',
                color: mode === 'login' ? 'var(--color-purple-dark)' : 'white',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                background: mode === 'register' ? 'white' : 'transparent',
                color: mode === 'register' ? 'var(--color-purple-dark)' : 'white',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem 2rem 2rem 2rem' }}>
          {/* Error Banner */}
          {errorMessage && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                color: '#B91C1C',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                color: '#15803D',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Authentication Button */}
          <div style={{ marginBottom: '1.15rem' }}>
            <GoogleAuthButton
              mode={mode}
              onSelectAccount={handleGoogleAuthSelect}
              loading={loading}
              customLabel={mode === 'register' ? 'Sign up with Google' : 'Sign in with Google'}
            />

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '1.15rem 0 0.5rem 0',
                gap: '0.75rem',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94A3B8',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                or continue with email
              </span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                      transition: 'border 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-purple-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.4rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                      transition: 'border 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-purple-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Demo Account Quick-Fill Pill */}
              <div
                onClick={handleFillDemo}
                style={{
                  background: '#F3EBFD',
                  border: '1px dashed var(--color-purple-primary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.6rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                title="Fill demo customer credentials"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-purple-dark)', fontWeight: '600' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--color-purple-primary)' }} />
                  <span>Click to auto-fill <strong>Demo Customer</strong></span>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'var(--color-purple-primary)', color: 'white', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>
                  1-Click
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.98rem',
                  fontWeight: '700',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? 'Signing In...' : 'Sign In to Account'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={17} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-purple-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={17} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-purple-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={17} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-purple-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  Create Password (min. 6 characters)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={17} style={{ position: 'absolute', left: '12px', color: '#94A3B8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.4rem 0.75rem 2.4rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-purple-primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.98rem',
                  fontWeight: '700',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? 'Creating Account...' : 'Register & Log In'}
              </button>
            </form>
          )}

          {/* Safe Privacy Footer */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              color: '#64748B',
              fontSize: '0.75rem',
            }}
          >
            <ShieldCheck size={14} style={{ color: '#16A34A' }} />
            <span>256-bit Encrypted. Your details are safe with White Mist.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
