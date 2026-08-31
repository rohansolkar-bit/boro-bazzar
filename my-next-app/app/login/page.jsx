'use client';

import { useContext, useState } from 'react';
import NextLink from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '@/src/context/UserAuthContext';
import { loginAPI } from '@/src/APIFunctions/Api_function_user_auth';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const userAuthData = useContext(AuthContext);
  const router = useRouter();

  const { user,login , isAuthenticated, setIsAuthenticated, loading, setLoadingState, error, setErrorState, token, setAuthToken, email, setEmailState, setUserState } = userAuthData;



  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
    setSubmitMessage('');
  }

  function validateForm() {
    const nextErrors = {};

    if (!formValues.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(formValues.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!formValues.password) {
      nextErrors.password = 'Password is required.';
    } else if (formValues.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitMessage('');
      return;
    }

     const loginUser = await loginAPI(formValues.email, formValues.password);
        if (loginUser && loginUser.success) {
          setLoadingState(false);
          setSubmitMessage('Registration successful! Please check your email to verify your account.');
          setTimeout(() => {
            setErrors({});
            setSubmitMessage('');
            login(loginUser.user);
            setUserState(true);
            setIsAuthenticated(true);
            setAuthToken(loginUser.accessToken);
            setEmailState(loginUser.user.email);
            setLoadingState(false);
            router.push('/');
          }, 2000);
        }
        console.log("loginUser", loginUser);

    
  }

  console.log("userAuthData", userAuthData);

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
          aria-labelledby="login-heading"
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
            id="login-heading"
            component="h1"
            sx={{ mb: 3, textAlign: 'center', fontSize: { xs: 20, sm: 22 }, fontWeight: 800, color: '#111827' }}
          >
            Login to your account
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
                inputprops={{ 'aria-describedby': errors.email ? 'email-helper-text' : undefined }}
                formhelpertextprops={{ id: 'email-helper-text' }}
              />

              <TextField
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formValues.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password || ' '}
                fullWidth
                autoComplete="current-password"
                inputprops={{ 'aria-describedby': errors.password ? 'password-helper-text' : undefined }}
                formhelpertextprops={{ id: 'password-helper-text' }}
                inputprops1={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        edge="end"
                        onClick={() => setShowPassword((isVisible) => !isVisible)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Box sx={{ mt: -0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formValues.rememberMe}
                    onChange={handleChange}
                    color="success"
                    size="small"
                  />
                }
                label="Remember me"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: 14, color: '#374151' } }}
              />
              <Link
                component={NextLink}
                href="/forgot-password"
                underline="hover"
                sx={{ fontSize: 14, fontWeight: 700, color: '#374151', '&:focus-visible': { outline: '2px solid #10b981', outlineOffset: 3 } }}
              >
                Forgot Password?
              </Link>
            </Box>

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
              Login
            </Button>

            {submitMessage ? (
              <Alert severity="success" role="status" sx={{ mt: 2 }}>
                {submitMessage}
              </Alert>
            ) : null}

            <Typography sx={{ mt: 2, textAlign: 'center', fontSize: 15, color: '#6b7280' }}>
              Not Registered?{' '}
              <Link
                component={NextLink}
                href="/register"
                underline="hover"
                sx={{ fontWeight: 800, color: '#00a884', '&:focus-visible': { outline: '2px solid #10b981', outlineOffset: 3 } }}
              >
                Sign Up
              </Link>
            </Typography>

            <Typography sx={{ mt: 2.25, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#4b5563' }}>
              Or continue with social account
            </Typography>

            <Button
              type="button"
              fullWidth
              variant="contained"
              startIcon={<FcGoogle aria-hidden="true" />}
              sx={{
                mt: 1.5,
                minHeight: 48,
                borderRadius: 1,
                bgcolor: '#f0f0f0',
                color: '#1f2937',
                fontWeight: 800,
                textTransform: 'uppercase',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#e7e7e7', boxShadow: 'none' },
              }}
              aria-label="Login with Google"
            >
              Login with Google
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}