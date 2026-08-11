import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Stack,
  Typography,
  Divider,
  Alert,
  Fade,
  Container,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  LocationOn as LocationOnIcon,
  PinDrop as PinDropIcon,
  Map as MapIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';

import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';
import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import { useStates } from '../../../../shared/hooks/ecom/locality/useStates';
import { useCities } from '../../../../shared/hooks/ecom/locality/useCities';
import { useToast } from '../../../../shared/hooks/useToast';
import { ErrorHandler } from '../../../../shared/helpers/ErrorHandler';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import {
  PrimaryButton,
  SecondaryButton,
  ToastContainer,
} from '../../../components/shared';

type SupplierFormData = Omit<Supplier, 'id'>;

const defaultFormData: SupplierFormData = {
  name: '',
  cnpj: '',
  email: '',
  phoneNumber: '',
  address: '',
  neighborhood: '',
  zipCode: '',
  stateId: 0,
  cityId: 0,
};

export default function SupplierEditPage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { supplier } = useAppContext();
  const { states } = useStates();
  const { toasts, removeToast, error: showToastError, success: showToastSuccess } = useToast();

  const [formData, setFormData] = useState<SupplierFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load cities based on selected state
  const { cities } = useCities(formData.stateId);

  // Load supplier data
  useEffect(() => {
    if (id) {
      const loadSupplier = async () => {
        try {
          // setIsLoading(true);
          const s = await supplier.getSupplierById(parseInt(id));
          if (s) {
            setFormData({
              name: s.name || '',
              cnpj: s.cnpj || '',
              email: s.email || '',
              phoneNumber: s.phoneNumber || '',
              address: s.address || '',
              neighborhood: s.neighborhood || '',
              zipCode: s.zipCode || '',
              stateId: s.stateId || 0,
              cityId: s.cityId || 0,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar fornecedor:', error);
          showToastError('Erro ao carregar os dados do fornecedor');
        } finally {
          setIsLoading(false);
        }
      };
      loadSupplier();
    }
   }, [id]);  //[id, supplier, showToastError*\]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
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
      ...(name === 'stateId' ? { cityId: 0 } : {}), // Reset city when state changes
    }));
    if (fieldErrors[name as string]) {
      setFieldErrors((prev) => ({ ...prev, [name as string]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Nome do fornecedor é obrigatório';
    }
    if (!formData.cnpj?.trim()) {
      errors.cnpj = 'CNPJ é obrigatório';
    } else if (!/^\d{14}$/.test(formData.cnpj.replace(/\D/g, ''))) {
      errors.cnpj = 'CNPJ inválido (14 dígitos)';
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
      const updatedSupplier: Supplier = {
        id: parseInt(id || '0'),
        ...formData,
      };
      await supplier.updateSupplier(updatedSupplier);
      showToastSuccess('Fornecedor atualizado com sucesso! 🎉');
      setTimeout(() => {
        navigate('/panel/supplier');
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
    navigate('/panel/supplier');
  };

  // Helper to format CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  // Helper to format phone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  // Helper to format ZIP code
  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cnpj') {
      setFormData((prev) => ({
        ...prev,
        cnpj: formatCNPJ(value),
      }));
    }
    if (name === 'phoneNumber') {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: formatPhone(value),
      }));
    }
    if (name === 'zipCode') {
      setFormData((prev) => ({
        ...prev,
        zipCode: formatZipCode(value),
      }));
    }
  };

  // Get state name
  const getStateName = (id: number) => {
    const state = states?.find((s) => s.id === id);
    return state?.name || '';
  };

  // Get city name
  const getCityName = (id: number) => {
    const city = cities?.find((c) => c.id === id);
    return city?.name || '';
  };

  // Loading state
  // if (isLoading) {
  //   return (
  //     <SidebarLayout isCollapsed={false}>
  //       <Container maxWidth="lg" sx={{ py: 8 }}>
  //         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
  //           <CircularProgress size={60} thickness={4} />
  //           <Typography variant="h6" color="text.secondary">
  //             Carregando fornecedor...
  //           </Typography>
  //         </Box>
  //       </Container>
  //     </SidebarLayout>
  //   );
  // }

  return (
    <SidebarLayout isCollapsed={false}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={500}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Voltar para lista de fornecedores">
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
              <Box sx={{ flex: 1 }}>
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
                  <EditIcon sx={{ color: theme.palette.primary.main }} />
                  Editar Fornecedor
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Atualize as informações do fornecedor
                  <Chip
                    size="small"
                    label={`ID: ${id}`}
                    sx={{ ml: 1, fontWeight: 500 }}
                    color="primary"
                    variant="outlined"
                  />
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
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Dados do Fornecedor */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                        <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Dados do Fornecedor
                      </Typography>
                      <Grid container spacing={2}>
                        {/* Name */}
                        <Grid item xs={12}>
                          <TextField
                            label="Nome do Fornecedor"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite o nome do fornecedor"
                            fullWidth
                            error={!!fieldErrors.name}
                            helperText={fieldErrors.name || ''}
                            InputProps={{
                              startAdornment: (
                                <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              ),
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Grid>

                        {/* CNPJ */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="CNPJ"
                            name="cnpj"
                            type="text"
                            value={formData.cnpj}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            placeholder="00.000.000/0000-00"
                            fullWidth
                            error={!!fieldErrors.cnpj}
                            helperText={fieldErrors.cnpj || ''}
                            InputProps={{
                              startAdornment: (
                                <QrCodeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              ),
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="E-mail"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="contato@fornecedor.com"
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
                        </Grid>

                        {/* Phone */}
                        <Grid item xs={12} md={6}>
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
                            error={!!fieldErrors.phoneNumber}
                            helperText={fieldErrors.phoneNumber || ''}
                            InputProps={{
                              startAdornment: (
                                <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              ),
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider />

                    {/* Endereço */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                        <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Endereço
                      </Typography>
                      <Grid container spacing={2}>
                        {/* Address */}
                        <Grid item xs={12}>
                          <TextField
                            label="Endereço"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            placeholder="Rua, número, complemento"
                            fullWidth
                            error={!!fieldErrors.address}
                            helperText={fieldErrors.address || ''}
                            InputProps={{
                              startAdornment: (
                                <LocationOnIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                              ),
                              sx: { borderRadius: 2 }
                            }}
                          />
                        </Grid>

                        {/* Neighborhood */}
                        <Grid item xs={12} md={6}>
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
                        </Grid>

                        {/* ZIP Code */}
                        <Grid item xs={12} md={6}>
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
                        </Grid>

                        {/* State */}
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth error={!!fieldErrors.stateId}>
                            <InputLabel id="state-select-label">Estado</InputLabel>
                            <Select
                              labelId="state-select-label"
                              label="Estado"
                              name="stateId"
                              value={formData.stateId}
                              onChange={handleSelectChange}
                              required
                              sx={{
                                borderRadius: 2,
                                '& .MuiSelect-select': {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }
                              }}
                              renderValue={(value) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {value === 0 ? 'Selecione um estado' : getStateName(value)}
                                </Box>
                              )}
                            >
                              <MenuItem value={0} disabled>
                                <Typography color="text.secondary">Selecione um estado</Typography>
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
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                <Typography variant="caption" color="error">
                                  {fieldErrors.stateId}
                                </Typography>
                              </Box>
                            )}
                          </FormControl>
                        </Grid>

                        {/* City */}
                        <Grid item xs={12} md={6}>
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
                              sx={{
                                borderRadius: 2,
                                '& .MuiSelect-select': {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }
                              }}
                              renderValue={(value) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {value === 0 ? 'Selecione uma cidade' : getCityName(value)}
                                </Box>
                              )}
                            >
                              <MenuItem value={0} disabled>
                                <Typography color="text.secondary">
                                  {!formData.stateId || formData.stateId === 0
                                    ? 'Selecione um estado primeiro'
                                    : 'Selecione uma cidade'}
                                </Typography>
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
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                <Typography variant="caption" color="error">
                                  {fieldErrors.cityId}
                                </Typography>
                              </Box>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
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
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      justifyContent="flex-end"
                      sx={{ mt: 1 }}
                    >
                      <SecondaryButton
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        startIcon={<CancelIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                        }}
                      >
                        Cancelar
                      </SecondaryButton>
                      <PrimaryButton
                        type="submit"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        startIcon={<SaveIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          minWidth: 180,
                        }}
                      >
                        {isSubmitting ? 'Atualizando...' : 'Atualizar Fornecedor'}
                      </PrimaryButton>
                    </Stack>
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