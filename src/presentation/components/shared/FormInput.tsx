import React from 'react';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { colors } from '../../themes/theme';

export interface FormInputProps extends MuiTextFieldProps {
  label: string;
  error?: boolean;
  helperText?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  variant = 'outlined',
  fullWidth = true,
  ...props
}) => {
  return (
    <MuiTextField
      label={label}
      error={error}
      helperText={helperText}
      variant={variant}
      fullWidth={fullWidth}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '&:hover fieldset': {
            borderColor: colors.primary,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary,
          },
        },
        '& .MuiOutlinedInput-input': {
          padding: '12px 14px',
        },
      }}
      {...props}
    />
  );
};
