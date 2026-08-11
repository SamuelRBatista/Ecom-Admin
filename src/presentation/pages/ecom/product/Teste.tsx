import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Button as MuiButton,
  Stack,
  Typography,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Fade,
  Grow,
  Container,
  Grid,
  Card,
  CardContent,
  alpha,
  useTheme,
  Zoom,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  Image as ImageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Category as CategoryIcon,
  Barcode as BarcodeIcon,
  Numbers as NumbersIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

import type { Product } from '../../../../domain/entities/ecom/product/Product';
import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import useCategory from '../../../../shared/hooks/ecom/product/useCategory';
import { useFormHandler } from '../../../../shared/hooks/useFormHandler';
import { useToast } from '../../../../shared/hooks/useToast';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import {
  FormPage,
  FormInput,
  PrimaryButton,
  SecondaryButton,
  ToastContainer,
} from '../../../components/shared';

import { productValidationSchema } from '../../../../shared/validators';
import { ErrorHandler } from '../../../../shared/helpers/ErrorHandler';

type ProductFormData = Omit<Product, 'id'>;

export default function ProductFormPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { categories } = useCategory();
  const { product } = useAppContext();
  const { toasts, removeToast, error: showToastError, success: showToastSuccess } = useToast();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleBlur,
    getFieldError,
    setFieldValue,
  } = useFormHandler<ProductFormData>({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      sku: '',
      barCode: '',
      imageUrl: '',
      categoryId: 0,
    },
    validationSchema: productValidationSchema,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToastError('Arquivo de imagem muito grande (máximo 5MB)');
      return;
    }
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToastError('Arquivo selecionado não é uma imagem válida');
      return;
    }
    
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    showToastSuccess('Imagem selecionada com sucesso!');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.categoryId) {
      setSubmitError('Selecione uma categoria');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price.toString());
      form.append('sku', formData.sku);
      form.append('barCode', formData.barCode);
      form.append('categoryId', formData.categoryId.toString());

      if (imageFile) {
        form.append('Image', imageFile);
      }

      await product.createProduct(form);
      showToastSuccess('Produto criado com sucesso! 🎉');
      setTimeout(() => {
        navigate('/panel/product');
      }, 1500);
    } catch (err) {
      const errorMessage = ErrorHandler.formatErrorMessage(err);
      setSubmitError(errorMessage);
      showToastError(errorMessage);
    }
  };

  const handleCancel = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    navigate('/panel/product');
  };

  // Helper to get category name
  const getCategoryName = (id: number) => {
    const category = categories?.find(c => c.id === id);
    return category?.name || '';
  };

  return (
    <SidebarLayout isCollapsed={false}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={500}>
          <Box>
            {/* Header with Back Button */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Voltar para lista de produtos">
                <IconButton 
                  onClick={handleCancel}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
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
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Criar Novo Produto
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Preencha os campos abaixo para adicionar um novo produto ao seu catálogo
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
                  <Grid container spacing={3}>
                    {/* Name */}
                    <Grid item xs={12}>
                      <FormInput
                        label="Nome do Produto"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!getFieldError('name')}
                        helperText={getFieldError('name')}
                        placeholder="Ex: iPhone 15 Pro Max"
                        required
                        icon={<NumbersIcon sx={{ color: 'text.secondary' }} />}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                      <FormInput
                        label="Descrição"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        multiline
                        rows={4}
                        error={!!getFieldError('description')}
                        helperText={getFieldError('description')}
                        placeholder="Descreva o produto em detalhes..."
                        icon={<DescriptionIcon sx={{ color: 'text.secondary' }} />}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>

                    {/* Price & SKU */}
                    <Grid item xs={12} md={6}>
                      <FormInput
                        label="Preço (R$)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!getFieldError('price')}
                        helperText={getFieldError('price')}
                        placeholder="0,00"
                        icon={<MoneyIcon sx={{ color: 'text.secondary' }} />}
                        variant="outlined"
                        fullWidth
                        inputProps={{ step: '0.01', min: '0' }}
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormInput
                        label="SKU"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!getFieldError('sku')}
                        helperText={getFieldError('sku')}
                        placeholder="Ex: SKU-12345"
                        icon={<NumbersIcon sx={{ color: 'text.secondary' }} />}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>

                    {/* Bar Code */}
                    <Grid item xs={12}>
                      <FormInput
                        label="Código de Barras"
                        name="barCode"
                        value={formData.barCode}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={!!getFieldError('barCode')}
                        helperText={getFieldError('barCode')}
                        placeholder="Ex: 7891234567890"
                        icon={<BarcodeIcon sx={{ color: 'text.secondary' }} />}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                    </Grid>

                    {/* Image Upload */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5 }}>
                        Imagem do Produto
                      </Typography>
                      
                      {!imagePreview ? (
                        <Paper
                          variant="outlined"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          sx={{
                            p: 4,
                            textAlign: 'center',
                            borderStyle: 'dashed',
                            borderWidth: 2,
                            borderColor: dragOver ? 'primary.main' : 'divider',
                            borderRadius: 3,
                            backgroundColor: dragOver ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            },
                          }}
                          component="label"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                          <Stack spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CloudUploadIcon 
                                sx={{ 
                                  fontSize: 40, 
                                  color: 'primary.main',
                                  opacity: 0.8,
                                }} 
                              />
                            </Box>
                            <Box>
                              <Typography variant="body1" fontWeight="500">
                                Clique ou arraste uma imagem aqui
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                PNG, JPG ou WEBP (máx. 5MB)
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      ) : (
                        <Zoom in>
                          <Box
                            sx={{
                              position: 'relative',
                              borderRadius: 3,
                              overflow: 'hidden',
                              border: `1px solid ${theme.palette.divider}`,
                              bgcolor: 'background.paper',
                            }}
                          >
                            <Box
                              component="img"
                              src={imagePreview}
                              alt="Preview"
                              sx={{
                                width: '100%',
                                maxHeight: 400,
                                objectFit: 'contain',
                                display: 'block',
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                display: 'flex',
                                gap: 1,
                              }}
                            >
                              <Chip
                                label="✓ Imagem selecionada"
                                size="small"
                                color="success"
                                sx={{ 
                                  bgcolor: alpha(theme.palette.success.main, 0.9),
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              />
                              <IconButton
                                onClick={removeImage}
                                size="small"
                                sx={{
                                  bgcolor: alpha(theme.palette.error.main, 0.9),
                                  color: 'white',
                                  '&:hover': { bgcolor: 'error.main' },
                                }}
                              >
                                <ClearIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Zoom>
                      )}
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!getFieldError('categoryId')}>
                        <InputLabel id="category-select-label">
                          <CategoryIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'middle' }} />
                          Categoria
                        </InputLabel>
                        <Select
                          labelId="category-select-label"
                          label="Categoria"
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleSelectChange}
                          onBlur={handleBlur}
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
                              <CategoryIcon fontSize="small" color="primary" />
                              {value === 0 ? 'Selecione uma categoria' : getCategoryName(value)}
                            </Box>
                          )}
                        >
                          <MenuItem value={0} disabled>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CategoryIcon fontSize="small" color="disabled" />
                              <Typography color="text.secondary">Selecione uma categoria</Typography>
                            </Box>
                          </MenuItem>
                          <Divider />
                          {categories && categories.length > 0 ? (
                            categories.map((category) => (
                              <MenuItem 
                                key={category.id} 
                                value={category.id}
                                sx={{ 
                                  py: 1.5,
                                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Avatar 
                                    sx={{ 
                                      width: 28, 
                                      height: 28, 
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      color: 'primary.main',
                                      fontSize: '0.875rem',
                                    }}
                                  >
                                    {category.name.charAt(0).toUpperCase()}
                                  </Avatar>
                                  <Typography>{category.name}</Typography>
                                </Box>
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              <Typography color="text.secondary">Nenhuma categoria encontrada</Typography>
                            </MenuItem>
                          )}
                        </Select>
                        {getFieldError('categoryId') && (
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                            <Typography variant="caption" color="error">
                              {getFieldError('categoryId')}
                            </Typography>
                          </Box>
                        )}
                      </FormControl>
                    </Grid>

                    {/* Submit Error Alert */}
                    {submitError && (
                      <Grid item xs={12}>
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
                      </Grid>
                    )}

                    {/* Action Buttons */}
                    <Grid item xs={12}>
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
                          startIcon={<ArrowBackIcon />}
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
                          {isSubmitting ? 'Criando...' : 'Criar Produto'}
                        </PrimaryButton>
                      </Stack>
                    </Grid>
                  </Grid>
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