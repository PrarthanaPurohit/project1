/**
 * useToast hook provides toast notification management.
 * Implements Requirements 1.1, 2.1, 3.4, 4.4:
 * - Manages toast notifications state
 * - Provides methods to show success/error/info/warning toasts
 */

import { useState, useCallback, useMemo } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message) => {
    showToast('success', message);
  }, [showToast]);

  const error = useCallback((message) => {
    showToast('error', message);
  }, [showToast]);

  const info = useCallback((message) => {
    showToast('info', message);
  }, [showToast]);

  const warning = useCallback((message) => {
    showToast('warning', message);
  }, [showToast]);

  return useMemo(() => ({
    toasts,
    showToast,
    hideToast,
    success,
    error,
    info,
    warning,
  }), [toasts, showToast, hideToast, success, error, info, warning]);
}
