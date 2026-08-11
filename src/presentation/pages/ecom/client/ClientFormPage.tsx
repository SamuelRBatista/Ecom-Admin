import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  Alert,
  Fade,
  Container,
  CircularProgress,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationOn as LocationOnIcon,
  PinDrop as PinDropIcon,
  Map as MapIcon,
  Error as ErrorIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

import type { Client } from '../../../../domain/entities/ecom/client/Client';
import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import { useStates } from '../../../../shared/hooks/ecom/locality/useStates';
import { useCities } from '../../../../shared/hooks/ecom/locality/useCities';
import { useToast } from '../../../../shared/hooks/useToast';
import { ErrorHandler } from '../../../../shared/helpers/ErrorHandler';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import { ToastContainer } from '../../../components/shared';

// Botões personalizados
const PrimaryButton: React.FC<{
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  sx?: any;
}> = ({ children, loading, disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled || loading}
    style={{
      padding: '10px 24px',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: 600,
      fontSize: '14px',
      minWidth: '180px',
      justifyContent: 'center',
    }}
  >
    {loading && <CircularProgress size={20} color="inherit" />}
    {children}
  </button>
);

const SecondaryButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  children: React.ReactNode;
  sx?: any;
}> = ({ children, disabled, ...props }) => (
  <button
    {...props}
    disabled={disabled}
    style={{
      padding: '10px 24px',
      backgroundColor: 'transparent',
      color: '#666',
      border: '1px solid #ddd',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: 600,
      fontSize: '14px',
      minWidth: '120px',
      justifyContent: 'center',
    }}
  >
    {children}
  </button>
);

type ClientFormData = Omit<Client, 'id'>;

const defaultFormData: ClientFormData = {
  name: '',
  cpf: '',
  email: '',
  phoneNumber: '',
  address: '',
  neighborhood: '',
  zipCode: '',
  stateId: 0,
  cityId: 0,
};

export default function ClientFormPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { client } = useAppContext();
  const { states } = useStates();
  const { toasts, removeToast, error: showToastError, success: showToastSuccess } = useToast();

  const [formData, setFormData] = useState<ClientFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { cities } = useCities(formData.stateId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    const newValue = Number(value);

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === 'stateId' ? { cityId: 0 } : {}),
    }));
    if (fieldErrors[name as string]) {
      setFieldErrors((prev) => ({ ...prev, [name as string]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Nome do cliente é obrigatório';
    }
    if (!formData.cpf?.trim()) {
      errors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      errors.cpf = 'CPF inválido (11 dígitos)';
    }
    if (!formData.email?.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'E-mail inválido';
    }
    if (!formData.phoneNumber?.trim()) {
      errors.phoneNumber = 'Telefone é obrigatório';
    }
    if (!formData.address?.trim()) {
      errors.address = 'Endereço é obrigatório';
    }
    if (!formData.neighborhood?.trim()) {
      errors.neighborhood = 'Bairro é obrigatório';
    }
    if (!formData.zipCode?.trim()) {
      errors.zipCode = 'CEP é obrigatório';
    }
    if (!formData.stateId || formData.stateId === 0) {
      errors.stateId = 'Selecione um estado';
    }
    if (!formData.cityId || formData.cityId === 0) {
      errors.cityId = 'Selecione uma cidade';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      showToastError('Por favor, corrija os campos destacados');
      return;
    }

    setIsSubmitting(true);

    try {
      const newClient: Client = { id: 0, ...formData };
      await client.createClient(newClient);
      showToastSuccess('Cliente cadastrado com sucesso! 🎉');
      setTimeout(() => {
        navigate('/panel/client');
      }, 1500);
    } catch (err) {
      const errorMessage = ErrorHandler.formatErrorMessage(err);
      setSubmitError(errorMessage);
      showToastError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/panel/client');
  };

  // Formatadores
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      setFormData((prev) => ({ ...prev, cpf: formatCPF(value) }));
    }
    if (name === 'phoneNumber') {
      setFormData((prev) => ({ ...prev, phoneNumber: formatPhone(value) }));
    }
    if (name === 'zipCode') {
      setFormData((prev) => ({ ...prev, zipCode: formatZipCode(value) }));
    }
  };

  const getStateName = (id: number) => {
    const state = states?.find((s) => s.id === id);
    return state?.name || '';
  };

  const getCityName = (id: number) => {
    const city = cities?.find((c) => c.id === id);
    return city?.name || '';
  };

  return (
    <SidebarLayout isCollapsed={false}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={500}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Voltar para lista de clientes">
                <IconButton
                  onClick={handleCancel}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="700"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <PersonIcon sx={{ color: theme.palette.primary.main }} />
                  Cadastrar Cliente
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Preencha os campos abaixo para adicionar um novo cliente
                </Typography>
              </Box>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Dados do Cliente */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                        <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Dados do Cliente
                      </Typography>

                      {/* Name */}
                      <TextField
                        label="Nome do Cliente"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Digite o nome completo do cliente"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={!!fieldErrors.name}
                        helperText={fieldErrors.name || ''}
                        InputProps={{
                          startAdornment: (
                            <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        {/* CPF */}
                        <Box sx={{ flex: 1 }}>
                          <TextField
                            label="CPF"
                            name="cpf"
                            type="text"
                            value={formData.cpf}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            placeholder="000.000.000-00"
                            fullWidth
                            error={!!fieldErrors.cpf}
                            helperText={fieldErrors.cpf || ''}
                            InputProps={{
                              startAdornment: (
                                <BadgeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              ),
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Box>

                        {/* Email */}
                        <Box sx={{ flex: 1 }}>
                          <TextField
                            label="E-mail"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="cliente@email.com"
                            fullWidth
                            error={!!fieldErrors.email}
                            helperText={fieldErrors.email || ''}
                            InputProps={{
                              startAdornment: (
                                <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              ),
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Phone */}
                      <TextField
                        label="Telefone"
                        name="phoneNumber"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        placeholder="(00) 00000-0000"
                        fullWidth
                        sx={{ mt: 2 }}
                        error={!!fieldErrors.phoneNumber}
                        helperText={fieldErrors.phoneNumber || ''}
                        InputProps={{
                          startAdornment: (
                            <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Box>

                    <Divider />

                    {/* Endereço */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                        <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Endereço
                      </Typography>

                      {/* Address */}
                      <TextField
                        label="Endereço"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Rua, número, complemento"
                        fullWidth
                        sx={{ mb: 2 }}
                        error={!!fieldErrors.address}
                        helperText={fieldErrors.address || ''}
                        InputProps={{
                          startAdornment: (
                            <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                          ),
                          sx: { borderRadius: 2 }
                        }}
                      />

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        {/* Neighborhood */}
                        <Box sx={{ flex: 1 }}>
                          <TextField
                            label="Bairro"
                            name="neighborhood"
                            type="text"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite o bairro"
                            fullWidth
                            error={!!fieldErrors.neighborhood}
                            helperText={fieldErrors.neighborhood || ''}
                            InputProps={{
                              startAdornment: (
                                <MapIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              ),
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Box>

                        {/* ZIP Code */}
                        <Box sx={{ flex: 1 }}>
                          <TextField
                            label="CEP"
                            name="zipCode"
                            type="text"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            placeholder="00000-000"
                            fullWidth
                            error={!!fieldErrors.zipCode}
                            helperText={fieldErrors.zipCode || ''}
                            InputProps={{
                              startAdornment: (
                                <PinDropIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              ),
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
                        {/* State */}
                        <Box sx={{ flex: 1 }}>
                          <FormControl fullWidth error={!!fieldErrors.stateId}>
                            <InputLabel id="state-select-label">Estado</InputLabel>
                            <Select
                              labelId="state-select-label"
                              label="Estado"
                              name="stateId"
                              value={formData.stateId}
                              onChange={handleSelectChange}
                              required
                              sx={{ borderRadius: 2 }}
                              renderValue={(value) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {value === 0 ? 'Selecione um estado' : getStateName(value)}
                                </Box>
                              )}
                            >
                              <MenuItem value={0} disabled>
                                Selecione um estado
                              </MenuItem>
                              {states && states.length > 0 ? (
                                states.map((state) => (
                                  <MenuItem key={state.id} value={state.id}>
                                    {state.name}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>Nenhum estado encontrado</MenuItem>
                              )}
                            </Select>
                            {fieldErrors.stateId && (
                              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                {fieldErrors.stateId}
                              </Typography>
                            )}
                          </FormControl>
                        </Box>

                        {/* City */}
                        <Box sx={{ flex: 1 }}>
                          <FormControl fullWidth error={!!fieldErrors.cityId}>
                            <InputLabel id="city-select-label">Cidade</InputLabel>
                            <Select
                              labelId="city-select-label"
                              label="Cidade"
                              name="cityId"
                              value={formData.cityId}
                              onChange={handleSelectChange}
                              required
                              disabled={!formData.stateId || formData.stateId === 0}
                              sx={{ borderRadius: 2 }}
                              renderValue={(value) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {value === 0 ? 'Selecione uma cidade' : getCityName(value)}
                                </Box>
                              )}
                            >
                              <MenuItem value={0} disabled>
                                {!formData.stateId || formData.stateId === 0
                                  ? 'Selecione um estado primeiro'
                                  : 'Selecione uma cidade'}
                              </MenuItem>
                              {cities && cities.length > 0 ? (
                                cities.map((city) => (
                                  <MenuItem key={city.id} value={city.id}>
                                    {city.name}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>
                                  {!formData.stateId || formData.stateId === 0
                                    ? 'Selecione um estado primeiro'
                                    : 'Nenhuma cidade encontrada'}
                                </MenuItem>
                              )}
                            </Select>
                            {fieldErrors.cityId && (
                              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                {fieldErrors.cityId}
                              </Typography>
                            )}
                          </FormControl>
                        </Box>
                      </Box>
                    </Box>

                    {/* Submit Error Alert */}
                    {submitError && (
                      <Fade in>
                        <Alert
                          severity="error"
                          icon={<ErrorIcon />}
                          sx={{ borderRadius: 2 }}
                          onClose={() => setSubmitError(null)}
                        >
                          {submitError}
                        </Alert>
                      </Fade>
                    )}

                    {/* Action Buttons */}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'flex-end' }}>
                      <SecondaryButton
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        startIcon={<CancelIcon />}
                      >
                        Cancelar
                      </SecondaryButton>
                      <PrimaryButton
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        startIcon={<SaveIcon />}
                      >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar Cliente'}
                      </PrimaryButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </form>
          </Box>
        </Fade>
      </Container>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </SidebarLayout>
  );
}