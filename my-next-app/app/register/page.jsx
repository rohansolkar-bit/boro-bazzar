'use client';

import { useContext, useEffect, useState } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '@/src/context/UserAuthContext';
import { register } from '@/src/APIFunctions/Api_function_user_auth';
import { useRouter } from 'next/navigation';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {

  const userAuthData = useContext(AuthContext);
  const router = useRouter();

  const { user , isAuthenticated, setIsAuthenticated, loading, setLoadingState, error, setErrorState, token, setAuthToken, email, setEmailState, setUserState } = userAuthData;

  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const trimmedName = formValues.name.trim();

    if (!trimmedName) {
      nextErrors.name = 'Name is required.';
    } else if (trimmedName.length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.';
    }

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

    if (!formValues.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your password.';
    } else if (formValues.confirmPassword !== formValues.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formValues.acceptTerms) {
      nextErrors.acceptTerms = 'You must agree before creating an account.';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateForm();
    setLoadingState(true);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitMessage('');
      return;
    }

    setErrors({});
    const resgisterUser = await register(formValues.name, formValues.email, formValues.password, formValues.confirmPassword);
    if (resgisterUser && resgisterUser.success) {
      setLoadingState(false);
      setSubmitMessage('Registration successful! Please check your email to verify your account.');
      setTimeout(() => {
        setSubmitMessage('');
        setUserState(formValues);
        setEmailState(formValues.email);
         setLoadingState(false);
        router.push('/verify-otp');
      }, 2000);
    }
    console.log("resgisterUser", resgisterUser);

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
          aria-labelledby="register-heading"
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
            id="register-heading"
            component="h1"
            sx={{ mb: 3, textAlign: 'center', fontSize: { xs: 20, sm: 22 }, fontWeight: 800, color: '#111827' }}
          >
            Create your account
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2.25}>
              <TextField
                id="name"
                name="name"
                label="Name"
                value={formValues.name}
                onChange={handleChange}
                error={Boolean(errors.name)}
                helperText={errors.name || ' '}
                fullWidth
                autoComplete="name"
                inputprops={{ 'aria-describedby': errors.name ? 'name-helper-text' : undefined }}
                formhelpertextprops={{ id: 'name-helper-text' }}
              />

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
                autoComplete="new-password"
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
                inputprops={{ 'aria-describedby': errors.confirmPassword ? 'confirm-password-helper-text' : undefined }}
                formhelpertextprops={{ id: 'confirm-password-helper-text' }}
                inputprops1={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        edge="end"
                        onClick={() => setShowConfirmPassword((isVisible) => !isVisible)}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={formValues.acceptTerms}
                  onChange={handleChange}
                  color="success"
                  size="small"
                  inputprops={{ 'aria-describedby': errors.acceptTerms ? 'terms-helper-text' : undefined }}
                />
              }
              label="I agree to the terms and privacy policy"
              sx={{ mt: -0.5, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { pt: 0.6, fontSize: 14, color: '#374151' } }}
            />
            {errors.acceptTerms ? (
              <Typography id="terms-helper-text" role="alert" sx={{ mt: -0.5, ml: 4, fontSize: 12, color: 'error.main' }}>
                {errors.acceptTerms}
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
              Register
            </Button>

            {submitMessage ? (
              <Alert severity="success" role="status" sx={{ mt: 2 }}>
                {submitMessage}
              </Alert>
            ) : null}

            <Typography sx={{ mt: 2, textAlign: 'center', fontSize: 15, color: '#6b7280' }}>
              Already Registered?{' '}
              <Link
                component={NextLink}
                href="/login"
                underline="hover"
                sx={{ fontWeight: 800, color: '#00a884', '&:focus-visible': { outline: '2px solid #10b981', outlineOffset: 3 } }}
              >
                Login
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
              aria-label="Register with Google"
            >
              Register with Google
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}