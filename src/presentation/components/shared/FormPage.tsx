import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { colors } from '../../themes/theme';

interface FormPageProps {
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  error?: string | null;
  loading?: boolean;
}

export const FormPage: React.FC<FormPageProps> = ({
  title,
  description,
  onSubmit,
  children,
  error,
  loading = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: colors.background,
        minHeight: '100vh',
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '800px',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            marginBottom: '8px',
            color: colors.primary,
            fontSize: '2rem',
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            sx={{
              color: colors.text.secondary,
              marginBottom: '24px',
            }}
          >
            {description}
          </Typography>
        )}

        <Divider sx={{ marginBottom: '24px', backgroundColor: colors.border }} />

        {error && (
          <Alert severity="error" sx={{ marginBottom: '24px', borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={onSubmit}>
          <Stack spacing={3}>
            {children}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
