// shared/components/shared/MoneyInput.tsx
import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, TextFieldProps } from '@mui/material';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';

export interface MoneyInputProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'type'> {
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  label = 'Preço (R$)',
  placeholder = 'R$ 0,00',
  disabled = false,
  required = false,
  fullWidth = true,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  // Formata valor para exibição
  const formatCurrency = (val: number): string => {
    if (val === undefined || val === null || isNaN(val)) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Converte string para número
  const parseCurrency = (val: string): number => {
    if (!val) return 0;
    // Remove tudo exceto números e vírgula
    const cleaned = val.replace(/[^\d,]/g, '');
    if (!cleaned) return 0;
    // Substitui vírgula por ponto
    const normalized = cleaned.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Atualiza o display quando o value prop muda
  useEffect(() => {
    const formatted = formatCurrency(value || 0);
    setDisplayValue(formatted);
  }, [value]);

  // Manipula mudanças no input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Se o campo estiver vazio
    if (!rawValue || rawValue === 'R$' || rawValue === 'R$ ') {
      setDisplayValue('R$ 0,00');
      const event = {
        target: {
          name: name,
          value: 0,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
      return;
    }

    // Extrai apenas números e vírgula
    const numbersOnly = rawValue.replace(/[^\d,]/g, '');
    
    if (numbersOnly === '') {
      setDisplayValue('R$ 0,00');
      const event = {
        target: {
          name: name,
          value: 0,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
      return;
    }

    // Converte para número
    const numericValue = parseCurrency(numbersOnly);
    
    // Formata para exibição
    const formatted = formatCurrency(numericValue);
    setDisplayValue(formatted);
    
    // Dispara o onChange com o valor numérico
    const event = {
      target: {
        name: name,
        value: numericValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  // Manipula o foco
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.select();
    }, 0);
  };

  // Manipula o blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const currentValue = value || 0;
    setDisplayValue(formatCurrency(currentValue));
    
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <TextField
      {...props}
      type="text"
      label={label}
      name={name}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MoneyIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        sx: {
          borderRadius: 2,
          '& input': {
            fontWeight: 500,
            fontSize: '1rem',
          },
        },
      }}
    />
  );
};

export default MoneyInput;