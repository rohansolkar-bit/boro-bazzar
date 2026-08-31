'use client';

import { useContext, useState } from 'react';
import NextLink from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';
import HelpIcon from '@mui/icons-material/Help';
import { forgotpassword } from '@/src/APIFunctions/Api_function_user_auth';
import { AuthContext } from '@/src/context/UserAuthContext';
const { useRouter } = require('next/navigation');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const userAuthData = useContext(AuthContext);
  const router = useRouter();

  const { user,login , isAuthenticated, setIsAuthenticated, loading, setLoadingState, error, setErrorState, token, setAuthToken, setEmailState, setUserState } = userAuthData;


  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  function handleEmailChange(event) {
    setEmail(event.target.value);
    setEmailError('');
    setSubmitMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('Email is required.');
      setSubmitMessage('');
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setEmailError('Enter a valid email address.');
      setSubmitMessage('');
      return;
    }

    const forgotUserpasword = await forgotpassword(trimmedEmail);
    if (forgotUserpasword && forgotUserpasword.success) {
      setLoadingState(false);
      setSubmitMessage('Registration successful! Please check your email to verify your account.');
      setTimeout(() => {
        setEmailError('');
        setSubmitMessage('');
        setEmailState(trimmedEmail);
        setLoadingState(false);
        router.push('/verify-otp');
      }, 2000);
    }
    console.log("forgotUserpasword", forgotUserpasword);



    setEmailError('');
    setSubmitMessage('OTP request validated successfully. Connect this form to your password reset API next.');
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
          aria-labelledby="forgot-password-heading"
          sx={{
            mx: 'auto',
            width: '100%',
            maxWidth: 360,
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'white',
            px: { xs: 2.5, sm: 4 },
            py: { xs: 3.5, sm: 4 },
            textAlign: 'center',
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: 'relative',
              mx: 'auto',
              mb: 1.5,
              display: 'flex',
              height: 62,
              width: 62,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              color: '#f59e0b',
            }}
          >
            <LockResetIcon sx={{ fontSize: 56 }} />
            <HelpIcon
              sx={{
                position: 'absolute',
                right: 1,
                bottom: 4,
                borderRadius: '50%',
                bgcolor: 'white',
                color: '#0ea5e9',
                fontSize: 23,
              }}
            />
          </Box>

          <Typography id="forgot-password-heading" component="h1" sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 800, color: '#111827' }}>
            Forgot Password
          </Typography>
          <Typography sx={{ mx: 'auto', mt: 1.25, maxWidth: 300, fontSize: 13, lineHeight: 1.55, color: '#6b7280' }}>
            Enter your registered email address and we will send you a One-Time Password (OTP) to reset your password.
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              id="forgot-email"
              name="email"
              label="Email Id"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={Boolean(emailError)}
              helperText={emailError || ' '}
              fullWidth
              autoComplete="email"
              s={{ 'aria-describedby': emailError ? 'forgot-email-helper-text' : undefined }}
              formhelpertextprops={{ id: 'forgot-email-helper-text' }}
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{
                mt: 0.5,
                minHeight: 44,
                borderRadius: 1,
                bgcolor: '#10b981',
                fontWeight: 800,
                textTransform: 'uppercase',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#059669', boxShadow: 'none' },
              }}
            >
              Submit
            </Button>

            {submitMessage ? (
              <Alert severity="success" role="status" sx={{ mt: 2, textAlign: 'left' }}>
                {submitMessage}
              </Alert>
            ) : null}

            <Link
              component={NextLink}
              href="/Login"
              underline="hover"
              sx={{
                mt: 2.25,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: 12,
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