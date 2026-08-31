'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const ApiErrorContext = createContext(null);

export function ApiErrorProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('error');

  const showError = useCallback((msg, type = 'error') => {
    setMessage(msg || 'Something went wrong. Please try again.');
    setSeverity(type);
    setOpen(true);
  }, []);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <ApiErrorContext.Provider value={{ showError }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%', fontWeight: 600 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ApiErrorContext.Provider>
  );
}

export function useApiError() {
  return useContext(ApiErrorContext);
}
