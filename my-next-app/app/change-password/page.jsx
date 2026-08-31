'use client';

import { useContext, useState } from 'react';
import NextLink from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/src/context/UserAuthContext';
import { changePassword } from '@/src/APIFunctions/Api_function_user_auth';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { email: contextEmail } = useContext(AuthContext);

  const [formValues, setFormValues] = useState({
    email: contextEmail || '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitMessage('');
    setSubmitError('');
  }

  function validateForm() {
    const nextErrors = {};

    if (!formValues.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(formValues.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!formValues.newPassword) {
      nextErrors.newPassword = 'New password is required.';
    } else if (formValues.newPassword.length < 8) {
      nextErrors.newPassword = 'Password must be at least 8 characters.';
    }

    if (!formValues.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your new password.';
    } else if (formValues.confirmPassword !== formValues.newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      const result = await changePassword(
        formValues.email,
        formValues.newPassword,
        formValues.confirmPassword
      );

      if (result && result.success) {
        setSubmitMessage('Password changed successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setSubmitError(result?.message || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: { xs: 'calc(100vh - 96px)', md: 'calc(100vh - 132px)' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        overflow: 'hidden',
        bgcolor: '#fafafa',
        px: 2,
        py: { xs: 6, sm: 8, lg: 10 },
        '&::before, &::after': {
          position: 'absolute',
          zIndex: 0,
          width: { xs: 190, sm: 260, lg: 360 },
          height: { xs: 190, sm: 260, lg: 360 },
          borderRadius: '50%',
          bgcolor: 'rgba(16, 185, 129, 0.13)',
          content: '""',
        },
        '&::before': {
          bottom: { xs: -95, sm: -120, lg: -160 },
          left: { xs: -120, sm: -150, lg: -210 },
        },
        '&::after': {
          top: { xs: -95, sm: -110, lg: 48 },
          right: { xs: -125, sm: -145, lg: -170 },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          component="section"
          aria-labelledby="change-password-heading"
          sx={{
            mx: 'auto',
            width: '100%',
            maxWidth: 444,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'white',
            px: { xs: 2.5, sm: 5 },
            py: { xs: 3.5, sm: 4 },
          }}
        >
          <Typography
            id="change-password-heading"
            component="h1"
            sx={{ mb: 3, textAlign: 'center', fontSize: { xs: 20, sm: 22 }, fontWeight: 800, color: '#111827' }}
          >
            Change Password
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2.25}>
              <TextField
                id="email"
                name="email"
                label="Email Id"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email || ' '}
                fullWidth
                autoComplete="email"
              />

              <TextField
                id="newPassword"
                name="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={formValues.newPassword}
                onChange={handleChange}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword || ' '}
                fullWidth
                autoComplete="new-password"
                inputprops={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        edge="end"
                        onClick={() => setShowNewPassword((v) => !v)}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formValues.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword || ' '}
                fullWidth
                autoComplete="new-password"
                inputprops={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        edge="end"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 1.5,
                minHeight: 50,
                borderRadius: 1,
                bgcolor: '#10b981',
                fontWeight: 800,
                textTransform: 'uppercase',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#059669', boxShadow: 'none' },
              }}
            >
              Change Password
            </Button>

            {submitMessage && (
              <Alert severity="success" role="status" sx={{ mt: 2 }}>
                {submitMessage}
              </Alert>
            )}

            {submitError && (
              <Alert severity="error" role="alert" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}

            <Link
              component={NextLink}
              href="/login"
              underline="hover"
              sx={{
                mt: 2.5,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: 13,
                fontWeight: 700,
                color: '#4b5563',
                '&:focus-visible': { outline: '2px solid #10b981', outlineOffset: 3 },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 14 }} aria-hidden="true" />
              Back to login
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}