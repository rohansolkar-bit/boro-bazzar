'use client';

import { useContext, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GppGoodIcon from '@mui/icons-material/GppGood';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '@/src/context/UserAuthContext';
import { verifyEmail } from '@/src/APIFunctions/Api_function_user_auth';
import { useRouter } from 'next/navigation';

const otpLength = 6;
// const maskedEmail = 'rinkuv.planetc@gmail.com';  

export default function VerifyOtpPage() {
  const [otpValues, setOtpValues] = useState(Array(otpLength).fill(''));
  const [error, setError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const inputRefs = useRef([]);
  const { setLoadingState, email , loading } = useContext(AuthContext);
  const router = useRouter();

  function focusInput(index) {
    inputRefs.current[index]?.focus();
  }

  function updateOtpValue(index, value) {
    const nextDigit = value.replace(/\D/g, '').slice(-1);

    setOtpValues((currentValues) => {
      const nextValues = [...currentValues];
      nextValues[index] = nextDigit;
      return nextValues;
    });

    setError('');
    setSubmitMessage('');

    if (nextDigit && index < otpLength - 1) {
      focusInput(index + 1);
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === 'Backspace' && !otpValues[index] && index > 0) {
      focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < otpLength - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  }

  function handlePaste(event) {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength);

    if (!pastedDigits) {
      return;
    }

    const nextValues = Array(otpLength).fill('');
    pastedDigits.split('').forEach((digit, index) => {
      nextValues[index] = digit;
    });

    setOtpValues(nextValues);
    setError('');
    setSubmitMessage('');
    focusInput(Math.min(pastedDigits.length, otpLength) - 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const otpCode = otpValues.join('');

    if (otpCode.length !== otpLength) {
      setError(`Enter the ${otpLength}-digit OTP sent to your email.`);
      setSubmitMessage('');
      const firstEmptyIndex = otpValues.findIndex((value) => !value);
      focusInput(firstEmptyIndex === -1 ? 0 : firstEmptyIndex);
      return;
    }

     const verifyEamilOtp = await verifyEmail(email , otpCode);
         setLoadingState(true)
        if (verifyEamilOtp && verifyEamilOtp.success) {
          setLoadingState(false);
          setSubmitMessage('Registration successful! Please check your email to verify your account.');
          setTimeout(() => {
            setSubmitMessage('');
             setLoadingState(false);
             setError('');
             setSubmitMessage('Email verified successfully! Redirecting to login...');
            router.push('/login');
          }, 2000);
        }
        console.log("verifyEamilOtp", verifyEamilOtp);

    
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
          aria-labelledby="verify-otp-heading"
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
              mx: 'auto',
              mb: 1.5,
              display: 'flex',
              height: 70,
              width: 70,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: 'rgba(59, 130, 246, 0.1)',
              color: '#60a5fa',
            }}
          >
            <GppGoodIcon sx={{ fontSize: 54 }} />
          </Box>

          <Typography id="verify-otp-heading" component="h1" sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 800, color: '#111827' }}>
            Verify OTP
          </Typography>
          <Typography sx={{ mt: 1.25, fontSize: 14, color: '#6b7280' }}>
            OTP send to{' '}
            <Box component="span" sx={{ fontWeight: 800, color: '#00a884' }}>
              {email}
            </Box>
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2.25 }}>
            <Stack direction="row" spacing={{ xs: 0.75, sm: 1 }} justifyContent="center" role="group" aria-label="One-time password">
              {otpValues.map((digit, index) => (
                <TextField
                  key={`otp-${index}`}
                  id={`otp-${index}`}
                  value={digit}
                  inputRef={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  onChange={(event) => updateOtpValue(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  error={Boolean(error)}
                  inputprops={{
                    'aria-label': `OTP digit ${index + 1}`,
                    inputMode: 'numeric',
                    maxLength: 1,
                    pattern: '[0-9]*',
                    style: { textAlign: 'center', fontSize: 18, fontWeight: 700, padding: '10px 0' },
                  }}
                  sx={{
                    width: { xs: 38, sm: 42 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      bgcolor: 'white',
                    },
                  }}
                />
              ))}
            </Stack>

            {error ? (
              <Typography role="alert" sx={{ mt: 1.25, fontSize: 12, color: 'error.main' }}>
                {error}
              </Typography>
            ) : null}

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              // disabled={loading}
              bgcolor="success"
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
            > {loading ? <CircularProgress size="25px" aria-label="Loading…" color="#FAFAFA" className='mr-2'/> : null}
              Verify OTP
            </Button>

            {submitMessage ? (
              <Alert severity="success" role="status" sx={{ mt: 2, textAlign: 'left' }}>
                {submitMessage}
              </Alert>
            ) : null}

            <Typography sx={{ mt: 2, fontSize: 13, color: '#6b7280' }}>
              Did not receive it?{' '}
              <Link
                href="#"
                underline="hover"
                sx={{ fontWeight: 800, color: '#00a884', '&:focus-visible': { outline: '2px solid #10b981', outlineOffset: 3 } }}
              >
                Resend OTP
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}