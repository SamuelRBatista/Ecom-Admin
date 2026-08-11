import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from '@mui/material';
import { DangerButton, SecondaryButton } from './Button';
import { colors } from '../../themes/theme';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.border}`,
          padding: '20px 24px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: colors.primary,
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <Box>
          <Typography
            variant="body1"
            sx={{
              color: colors.text.primary,
              lineHeight: 1.6,
            }}
          >
            {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          padding: '16px 24px',
          gap: '12px',
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <SecondaryButton onClick={onCancel} disabled={loading}>
          {cancelText}
        </SecondaryButton>
        {isDangerous ? (
          <DangerButton onClick={onConfirm} loading={loading}>
            {confirmText}
          </DangerButton>
        ) : (
          <DangerButton onClick={onConfirm} loading={loading}>
            {confirmText}
          </DangerButton>
        )}
      </DialogActions>
    </Dialog>
  );
};
