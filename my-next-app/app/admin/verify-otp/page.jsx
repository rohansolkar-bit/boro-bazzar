'use client';
import React, { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, Alert } from '@mui/material';
import { AuthContext } from '@/src/context/UserAuthContext';
import { verifyEmail } from '@/src/APIFunctions/Api_function_user_auth';
import AdminAuthLayout from '@/src/components/admin/AdminAuthLayout';

const OTP_LENGTH = 6;

export default function AdminVerifyOtpPage() {
  const router = useRouter();
  const { email, setLoadingState } = useContext(AuthContext);

  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  function focusInput(index) {
    inputRefs.current[index]?.focus();
  }

  function handleChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtpValues(prev => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setError('');
    if (digit && index < OTP_LENGTH - 1) focusInput(index + 1);
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) { e.preventDefault(); focusInput(index - 1); }
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) { e.preventDefault(); focusInput(index + 1); }
  }

  function handlePaste(e) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!digits) return;
    const next = Array(OTP_LENGTH).fill('');
    digits.split('').forEach((d, i) => { next[i] = d; });
    setOtpValues(next);
    focusInput(Math.min(digits.length, OTP_LENGTH) - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length !== OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      focusInput(otpValues.findIndex(v => !v));
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmail(email, otp);
      if (res && res.success) {
        setSubmitMessage('Email verified successfully! Redirecting...');
        setLoadingState(false);
        setTimeout(() => router.push('/admin/dashborad'), 2000);
      } else {
        setError(res?.message || 'Invalid OTP. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminAuthLayout>
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-xl px-8 py-10 shadow-sm text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M32 4L8 16v16c0 13.3 10.3 25.7 24 29 13.7-3.3 24-15.7 24-29V16L32 4z" fill="#e3f0ff" stroke="#3b82f6" strokeWidth="2"/>
                <path d="M32 4L8 16v16c0 13.3 10.3 25.7 24 29 13.7-3.3 24-15.7 24-29V16L32 4z" fill="url(#shield)" fillOpacity="0.4"/>
                <circle cx="40" cy="42" r="10" fill="#22c55e"/>
                <path d="M36 42l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="shield" x1="8" y1="4" x2="56" y2="49">
                    <stop stopColor="#60a5fa"/>
                    <stop offset="1" stopColor="#2563eb"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2">Verify OTP</h2>

          {email && (
            <p className="text-sm text-gray-500 mb-5">
              OTP send to{' '}
              <span className="text-teal-600 font-medium">{email}</span>
            </p>
          )}

          {submitMessage && <Alert severity="success" sx={{ mb: 2, textAlign: 'left' }}>{submitMessage}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{error}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            {/* OTP Boxes */}
            <div className="flex justify-center gap-2 mb-6">
              {otpValues.map((val, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  aria-label={`OTP digit ${i + 1}`}
                  className={`w-10 h-11 text-center text-lg font-semibold border rounded-lg outline-none transition-all
                    ${val ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-300 bg-white text-gray-900'}
                    focus:border-teal-500 focus:ring-2 focus:ring-teal-200`}
                />
              ))}
            </div>

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
              {loading ? <CircularProgress size={22} color="inherit" /> : 'VERIFY OTP'}
            </Button>
          </form>
        </div>
      </div>
    </AdminAuthLayout>
  );
}
