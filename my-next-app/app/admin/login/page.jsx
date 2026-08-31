'use client';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TextField, Button, Checkbox, FormControlLabel,
  IconButton, InputAdornment, CircularProgress, Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '@/src/context/UserAuthContext';
import { loginAPI } from '@/src/APIFunctions/Api_function_user_auth';
import AdminAuthLayout from '@/src/components/admin/AdminAuthLayout';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginPage() {
  const router = useRouter();
  const userAuthData = useContext(AuthContext);
  const { login, setIsAuthenticated, setLoadingState, setAuthToken, setEmailState, setUserState, setAdminState } = userAuthData;

  const [formValues, setFormValues] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, checked, type } = e.target;
    setFormValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSubmitMessage('');
    setSubmitError('');
  }

  function validate() {
    const errs = {};
    if (!formValues.email.trim()) errs.email = 'Email is required.';
    else if (!emailPattern.test(formValues.email)) errs.email = 'Enter a valid email address.';
    if (!formValues.password) errs.password = 'Password is required.';
    else if (formValues.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await loginAPI(formValues.email, formValues.password);
      if (res && res.success) {
        const role = res.role || 'user';

        if (role !== 'admin') {
          // Not an admin — deny access and show error
          setSubmitError('Access denied. This login is for administrators only.');
          // Clean up cookies set by loginAPI
          import('js-cookie').then(({ default: Cookies }) => {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('userRole');
          });
          return;
        }

        setSubmitMessage('Login successful! Redirecting to dashboard...');
        login(res.user);
        setIsAuthenticated(true);
        setAdminState(true);
        setUserState(false);
        setAuthToken(res.accessToken);
        setEmailState(res.user.email);
        setLoadingState(false);
        setTimeout(() => router.push('/admin/dashborad'), 1000);
      } else {
        setSubmitError(res?.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminAuthLayout>
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-6 leading-tight">
          Welcome Back!<br />
          <span className="text-xl">Sign in with your credentials.</span>
        </h1>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl px-8 py-8 shadow-sm">
          {submitMessage && <Alert severity="success" sx={{ mb: 2 }}>{submitMessage}</Alert>}
          {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

          {/* Google */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FcGoogle size={20} />}
            sx={{
              textTransform: 'none', borderColor: '#d1d5db', color: '#374151',
              '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
              borderRadius: '8px', py: 1.2, fontWeight: 500
            }}
          >
            Sign in with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 whitespace-nowrap">Or, Sign in with your email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <TextField
                  name="email"
                  type="email"
                  fullWidth
                  size="small"
                  value={formValues.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  autoComplete="email"
                  inputProps={{ 'aria-label': 'Email' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <TextField
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  size="small"
                  value={formValues.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(v => !v)} edge="end" aria-label="Toggle password">
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <FormControlLabel
                control={<Checkbox name="rememberMe" checked={formValues.rememberMe} onChange={handleChange} size="small" sx={{ color: '#14b8a6', '&.Mui-checked': { color: '#14b8a6' } }} />}
                label={<span className="text-sm text-gray-700">Remember Me</span>}
              />
              <Link href="/admin/forgot-password" className="text-sm font-semibold text-teal-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Don't have an account?{' '}
              <Link href="/admin/register" className="text-teal-600 font-semibold hover:underline">Sign Up</Link>
            </p>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3, py: 1.5, bgcolor: '#14b8a6', '&:hover': { bgcolor: '#0d9488' },
                textTransform: 'uppercase', fontWeight: 800, borderRadius: '8px',
                fontSize: '0.9rem', letterSpacing: '0.05em'
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'SIGN IN'}
            </Button>
          </form>
        </div>
      </div>
    </AdminAuthLayout>
  );
}
