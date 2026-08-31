'use client';

import { useEffect } from 'react';
import { useApiError } from '@/src/components/ApiErrorToast';
import { setApiErrorHandler } from '@/utils/AxiosAPICall';

export default function AxiosErrorBridge() {
  const { showError } = useApiError();

  useEffect(() => {
    setApiErrorHandler(showError);
  }, [showError]);

  return null;
}
