import React from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import { Toast } from '../../hooks/useToast';
import { colors } from '../themes/theme';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <Stack
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        gap: 1,
        pointerEvents: 'none',
        '& > *': {
          pointerEvents: 'auto',
        },
      }}
    >
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          severity={toast.type}
          onClose={() => onRemove(toast.id)}
          sx={{
            minWidth: '300px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              from: {
                transform: 'translateX(400px)',
                opacity: 0,
              },
              to: {
                transform: 'translateX(0)',
                opacity: 1,
              },
            },
          }}
        >
          {toast.message}
        </Alert>
      ))}
    </Stack>
  );
};
