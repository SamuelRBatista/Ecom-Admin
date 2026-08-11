import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';
import { colors } from '../../themes/theme';

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  loading = false,
  icon,
  children,
  disabled,
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={20} /> : icon}
    >
      {children}
    </MuiButton>
  );
};

interface PrimaryButtonProps extends ButtonProps {}

export const PrimaryButton: React.FC<PrimaryButtonProps> = (props) => (
  <Button
    variant="contained"
    sx={{
      backgroundColor: colors.primary,
      '&:hover': {
        backgroundColor: colors.primary,
      },
    }}
    {...props}
  />
);

interface SuccessButtonProps extends ButtonProps {}

export const SuccessButton: React.FC<SuccessButtonProps> = (props) => (
  <Button
    variant="contained"
    sx={{
      backgroundColor: colors.success,
      '&:hover': {
        backgroundColor: colors.secondary,
      },
    }}
    {...props}
  />
);

interface DangerButtonProps extends ButtonProps {}

export const DangerButton: React.FC<DangerButtonProps> = (props) => (
  <Button
    variant="contained"
    sx={{
      backgroundColor: colors.error,
      '&:hover': {
        backgroundColor: '#bb2d3b',
      },
    }}
    {...props}
  />
);

interface SecondaryButtonProps extends ButtonProps {}

export const SecondaryButton: React.FC<SecondaryButtonProps> = (props) => (
  <Button
    variant="outlined"
    sx={{
      borderColor: colors.primary,
      color: colors.primary,
      '&:hover': {
        borderColor: colors.primaryDark,
        backgroundColor: 'rgba(126, 101, 96, 0.04)',
      },
    }}
    {...props}
  />
);
