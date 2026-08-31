'use client';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, CircularProgress, Alert } from '@mui/material';
import { AuthContext } from '@/src/context/UserAuthContext';
import { forgotpassword } from '@/src/APIFunctions/Api_function_user_auth';
import AdminAuthLayout from '@/src/components/admin/AdminAuthLayout';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const { setEmailState, setLoadingState } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setEmail(e.target.value);
    setEmailError('');
    setSubmitMessage('');
    setSubmitError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) { setEmailError('Email is required.'); return; }
    if (!emailPattern.test(trimmed)) { setEmailError('Enter a valid email address.'); return; }

    setLoading(true);
    try {
      const res = await forgotpassword(trimmed);
      if (res && res.success) {
        setSubmitMessage('OTP sent! Check your email to reset your password.');
        setEmailState(trimmed);
        setLoadingState(false);
        setTimeout(() => router.push('/admin/verify-otp'), 2000);
      } else {
        setSubmitError(res?.message || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminAuthLayout>
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-xl px-8 py-10 shadow-sm text-center">
          {/* Lock icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="14" y="28" width="36" height="26" rx="4" fill="#f59e0b"/>
                <rect x="14" y="28" width="36" height="26" rx="4" fill="url(#lockGrad)" fillOpacity="0.9"/>
                <path d="M22 28V22a10 10 0 0120 0v6" stroke="#d97706" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="32" cy="41" r="4" fill="white" fillOpacity="0.9"/>
                <circle cx="44" cy="20" r="8" fill="#3b82f6"/>
                <path d="M41 20l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="lockGrad" x1="14" y1="28" x2="50" y2="54">
                    <stop stopColor="#fbbf24"/>
                    <stop offset="1" stopColor="#f59e0b"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Enter your registered email address and we'll send you a
            One-Time Password (OTP) to reset your password.
          </p>

          {submitMessage && <Alert severity="success" sx={{ mb: 2, textAlign: 'left' }}>{submitMessage}</Alert>}
          {submitError && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{submitError}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email Id"
              type="email"
              fullWidth
              size="small"
              value={email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
              autoComplete="email"
              inputProps={{ 'aria-label': 'Email address' }}
              sx={{ mb: 3, textAlign: 'left', '& label': { textAlign: 'left' } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.4, bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' },
                textTransform: 'uppercase', fontWeight: 800, borderRadius: '8px',
                fontSize: '0.88rem', letterSpacing: '0.06em',
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'SUBMIT'}
            </Button>
          </form>
        </div>
      </div>
    </AdminAuthLayout>
  );
}
