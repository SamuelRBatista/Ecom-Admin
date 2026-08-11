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
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Container,
  Card,
  CardContent,
  CircularProgress,
  alpha,
  useTheme,
  Chip,
  Grid,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Category as CategoryIcon,
  QrCodeScanner as BarcodeIcon,
  Numbers as NumbersIcon,
  Description as DescriptionIcon,
  Error as ErrorIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Style as StyleIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

import type { Product, ProductAttribute } from '../../../../domain/entities/ecom/product/Product';
import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import useCategory from '../../../../shared/hooks/ecom/product/useCategory';
import { useSupplier } from '../../../../shared/hooks/ecom/supplier/useSuppliers';
import { useToast } from '../../../../shared/hooks/useToast';
import { ErrorHandler } from '../../../../shared/helpers/ErrorHandler';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import {
  PrimaryButton,
  SecondaryButton,
  ToastContainer,
} from '../../../components/shared';
import MoneyInput from '../../../components/shared/MoneyInput';

// Valores padrão para o formulário
const defaultFormData: Product = {
  id: 0,
  name: '',
  description: '',
  shortDescription: '',
  price: 0,
  costPrice: 0,
  sku: '',
  barCode: '',
  imageUrl: '',
  categoryId: 0,
  supplierId: 0,
  stockQuantity: 0,
  minimumStock: 0,
  unitOfMeasure: 'UN',
  weight: 0,
  height: 0,
  width: 0,
  depth: 0,
  brand: '',
  model: '',
  color: '',
  size: '',
  material: '',
  manufacturer: '',
  manufactureDate: '',
  expirationDate: '',
  isActive: true,
  isFeatured: false,
  isNew: true,
  isDigital: false,
  hasVariants: false,
  averageRating: 0,
  totalReviews: 0,
  totalSales: 0,
  viewsCount: 0,
  createdAt: '',
  updatedAt: '',
  status: 'Draft',
  visibility: 'NotVisible',
  slug: '',
  metaTitle: '',
  metaDescription: '',
  observations: '',
  images: [],
  attributes: [],
};

export default function ProductEditPage() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategory();
  const { suppliers } = useSupplier();
  const { product } = useAppContext();
  const { toasts, removeToast, error: showToastError, success: showToastSuccess } = useToast();

  const [formData, setFormData] = useState<Product>(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Product['images']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [imageLoadError, setImageLoadError] = useState(false);
  
  // Atributos personalizados
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [newAttribute, setNewAttribute] = useState({ key: '', value: '', group: '' });
  const [showAttributeForm, setShowAttributeForm] = useState(false);


  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    const STATIC_FILES_BASE_URL = import.meta.env.VITE_STATIC_FILES_URL || 'https://localhost:7252';
    return `${STATIC_FILES_BASE_URL}/${cleanPath}`;
  };

  // Load product
  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          setIsLoading(true);
          const p = await product.getProductById(parseInt(id));
              console.log('🖼️ URL da imagem (imageUrl):', p?.imageUrl);
          if (p) {
            setFormData({
              id: p.id || 0,
              name: p.name || '',
              description: p.description || '',
              shortDescription: p.shortDescription || '',
              price: p.price || 0,
              costPrice: p.costPrice || 0,
              sku: p.sku || '',
              barCode: p.barCode || '',
              imageUrl: p.imageUrl || '',
              categoryId: p.categoryId || 0,
              supplierId: p.supplierId || 0,
              stockQuantity: p.stockQuantity || 0,
              minimumStock: p.minimumStock || 0,
              unitOfMeasure: p.unitOfMeasure || 'UN',
              weight: p.weight || 0,
              height: p.height || 0,
              width: p.width || 0,
              depth: p.depth || 0,
              brand: p.brand || '',
              model: p.model || '',
              color: p.color || '',
              size: p.size || '',
              material: p.material || '',
              manufacturer: p.manufacturer || '',
              manufactureDate: p.manufactureDate || '',
              expirationDate: p.expirationDate || '',
              isActive: p.isActive ?? true,
              isFeatured: p.isFeatured ?? false,
              isNew: p.isNew ?? true,
              isDigital: p.isDigital ?? false,
              hasVariants: p.hasVariants ?? false,
              averageRating: p.averageRating || 0,
              totalReviews: p.totalReviews || 0,
              totalSales: p.totalSales || 0,
              viewsCount: p.viewsCount || 0,
              createdAt: p.createdAt || '',
              updatedAt: p.updatedAt || '',
              status: p.status || 'Draft',
              visibility: p.visibility || 'NotVisible',
              slug: p.slug || '',
              metaTitle: p.metaTitle || '',
              metaDescription: p.metaDescription || '',
              observations: p.observations || '',
              images: p.images || [],
              attributes: p.attributes || [],
            });

         if (p.imageUrl) {
            const fullImageUrl = getImageUrl(p.imageUrl);
            console.log('✅ URL completa da imagem:', fullImageUrl);
            setImagePreview(fullImageUrl);
            setImageLoadError(false);
          }

            if (p.images) {
              setExistingImages(p.images);
            }

            if (p.attributes) {
              setAttributes(p.attributes);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar produto:', error);
          showToastError('Erro ao carregar os dados do produto');
        } finally {
          setIsLoading(false);
        }
      };
      loadProduct();
    }
  }, [id, product]);

  // HANDLER PARA TODOS OS INPUTS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      let newValue: any = value;
      
      if (name === 'price' || name === 'costPrice' || name === 'stockQuantity' || 
          name === 'minimumStock' || name === 'weight' || name === 'height' || 
          name === 'width' || name === 'depth') {
        if (value === '') {
          newValue = 0;
        } else {
          const numValue = parseFloat(String(value));
          newValue = isNaN(numValue) ? 0 : numValue;
        }
      }
      
      return {
        ...prev,
        [name]: newValue,
      };
    });
    
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handler para Select
  const handleSelectChange = (e: SelectChangeEvent<number | string>) => {
    const { name, value } = e.target;
    const newValue = typeof value === 'string' ? value : Number(value);
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    if (fieldErrors[name as string]) {
      setFieldErrors((prev) => ({ ...prev, [name as string]: '' }));
    }
  };

  // Handler para atributos
  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAttribute((prev) => ({ ...prev, [name]: value }));
  };

  const addAttribute = () => {
    if (!newAttribute.key.trim() || !newAttribute.value.trim()) {
      showToastError('Preencha a chave e o valor do atributo');
      return;
    }

    const newAttr: ProductAttribute = {
      id: 0,
      key: newAttribute.key.trim(),
      value: newAttribute.value.trim(),
      group: newAttribute.group.trim() || undefined,
      displayOrder: attributes.length,
    };

    setAttributes([...attributes, newAttr]);
    setNewAttribute({ key: '', value: '', group: '' });
    setShowAttributeForm(false);
    showToastSuccess('Atributo adicionado com sucesso!');
  };

  const removeAttribute = (index: number) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) => file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')
      );
      setAdditionalImages((prev) => [...prev, ...validFiles]);
      showToastSuccess(`${validFiles.length} imagem(ns) adicionada(s)`);
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
    if (file.size > 5 * 1024 * 1024) {
      showToastError('Arquivo de imagem muito grande (máximo 5MB)');
      return;
    }
    if (!file.type.startsWith('image/')) {
      showToastError('Arquivo selecionado não é uma imagem válida');
      return;
    }
    
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setImageLoadError(false);
    showToastSuccess('Imagem selecionada com sucesso!');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(formData.imageUrl || null);
    setImageLoadError(false);
    if (imagePreview && imagePreview !== formData.imageUrl) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Nome do produto é obrigatório';
    }
    if (!formData.description?.trim()) {
      errors.description = 'Descrição é obrigatória';
    }
    if (formData.price <= 0) {
      errors.price = 'Preço deve ser maior que zero';
    }
    if (!formData.sku?.trim()) {
      errors.sku = 'SKU é obrigatório';
    }
    if (!formData.categoryId || formData.categoryId === 0) {
      errors.categoryId = 'Selecione uma categoria';
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
      const form = new FormData();
      
      // Campos básicos
      form.append('id', formData.id.toString());
      form.append('name', formData.name || '');
      form.append('description', formData.description || '');
      form.append('shortDescription', formData.shortDescription || '');
      form.append('sku', formData.sku || '');
      form.append('barCode', formData.barCode || '');
      form.append('price', formData.price.toString());
      form.append('costPrice', formData.costPrice?.toString() || '0');
      form.append('categoryId', formData.categoryId.toString());
      form.append('supplierId', formData.supplierId?.toString() || '');
      form.append('stockQuantity', formData.stockQuantity?.toString() || '0');
      form.append('minimumStock', formData.minimumStock?.toString() || '');
      form.append('unitOfMeasure', formData.unitOfMeasure || 'UN');
      form.append('weight', formData.weight?.toString() || '');
      form.append('height', formData.height?.toString() || '');
      form.append('width', formData.width?.toString() || '');
      form.append('depth', formData.depth?.toString() || '');
      form.append('brand', formData.brand || '');
      form.append('model', formData.model || '');
      form.append('color', formData.color || '');
      form.append('size', formData.size || '');
      form.append('material', formData.material || '');
      form.append('manufacturer', formData.manufacturer || '');
      form.append('manufactureDate', formData.manufactureDate || '');
      form.append('expirationDate', formData.expirationDate || '');
      form.append('observations', formData.observations || '');
      
      // Status
      form.append('isActive', String(formData.isActive));
      form.append('isFeatured', String(formData.isFeatured));
      form.append('isNew', String(formData.isNew));
      form.append('isDigital', String(formData.isDigital));

      // Imagem principal
      if (imageFile) {
        form.append('Image', imageFile);
      }

      // Imagens adicionais
      additionalImages.forEach((file) => {
        form.append('AdditionalImages', file);
      });

      // Atributos
      attributes.forEach((attr) => {
        form.append('Attributes', JSON.stringify({
          key: attr.key,
          value: attr.value,
          group: attr.group || '',
        }));
      });

      // Imagens existentes (para manter)
      existingImages.forEach((img) => {
        form.append('ExistingImages', JSON.stringify({
          id: img.id,
          url: img.url,
          isMain: img.isMain,
        }));
      });

      if (formData.imageUrl && !imageFile) {
        form.append('ExistingImageUrl', formData.imageUrl);
      }

      await product.updateProduct(form);
      showToastSuccess('Produto atualizado com sucesso! 🎉');
      
      setTimeout(() => {
        navigate('/panel/product');
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
    if (imagePreview && imagePreview !== formData.imageUrl) {
      URL.revokeObjectURL(imagePreview);
    }
    navigate('/panel/product');
  };

  // Loading state
  if (isLoading) {
    return (
      <SidebarLayout isCollapsed={false}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary">
              Carregando produto...
            </Typography>
          </Box>
        </Container>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout isCollapsed={false}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={500}>
          <Box>
            {/* Header */}
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <EditIcon sx={{ color: theme.palette.primary.main }} />
                  Editar Produto
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Atualize as informações do produto #{formData.id || 0}
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

                    {/* ===== INFORMAÇÕES BÁSICAS ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Informações Básicas
                    </Typography>

                    <TextField
                      label="Nome do Produto"
                      name="name"
                      value={formData.name ?? ''}
                      onChange={handleInputChange}
                      required
                      placeholder="Digite o nome do produto"
                      fullWidth
                      error={!!fieldErrors.name}
                      helperText={fieldErrors.name || ''}
                      InputProps={{
                        startAdornment: (
                          <NumbersIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />

                    <TextField
                      label="Descrição Curta"
                      name="shortDescription"
                      value={formData.shortDescription ?? ''}
                      onChange={handleInputChange}
                      placeholder="Breve descrição para listagens"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />

                    <TextField
                      label="Descrição Completa"
                      name="description"
                      value={formData.description ?? ''}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={4}
                      placeholder="Descreva o produto em detalhes..."
                      fullWidth
                      error={!!fieldErrors.description}
                      helperText={fieldErrors.description || ''}
                      InputProps={{
                        startAdornment: (
                          <DescriptionIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />

                    <Divider />

                    {/* ===== PREÇOS ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Preços
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <MoneyInput
                          label="Preço de Venda (R$)"
                          name="price"
                          value={formData.price ?? 0}
                          onChange={handleInputChange}
                          onBlur={() => {}}
                          required
                          error={!!fieldErrors.price}
                          helperText={fieldErrors.price || ''}
                          placeholder="R$ 0,00"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <MoneyInput
                          label="Preço de Custo (R$)"
                          name="costPrice"
                          value={formData.costPrice ?? 0}
                          onChange={handleInputChange}
                          onBlur={() => {}}
                          placeholder="R$ 0,00"
                        />
                      </Grid>
                    </Grid>

                    <Divider />

                    {/* ===== IDENTIFICAÇÃO ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Identificação
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="SKU"
                          name="sku"
                          value={formData.sku ?? ''}
                          onChange={handleInputChange}
                          required
                          placeholder="Ex: SKU-12345"
                          fullWidth
                          error={!!fieldErrors.sku}
                          helperText={fieldErrors.sku || ''}
                          InputProps={{
                            startAdornment: (
                              <NumbersIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Código de Barras"
                          name="barCode"
                          value={formData.barCode ?? ''}
                          onChange={handleInputChange}
                          placeholder="Ex: 7891234567890"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <BarcodeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Divider />

                    {/* ===== ESTOQUE ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Estoque
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Quantidade em Estoque"
                          name="stockQuantity"
                          type="number"
                          value={formData.stockQuantity ?? 0}
                          onChange={handleInputChange}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InventoryIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Estoque Mínimo"
                          name="minimumStock"
                          type="number"
                          value={formData.minimumStock ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      label="Unidade de Medida"
                      name="unitOfMeasure"
                      value={formData.unitOfMeasure ?? 'UN'}
                      onChange={handleInputChange}
                      placeholder="Ex: UN, KG, L, M"
                      fullWidth
                      InputProps={{
                        sx: { borderRadius: 2 }
                      }}
                    />

                    <Divider />

                    {/* ===== DIMENSÕES ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Dimensões
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Peso (kg)"
                          name="weight"
                          type="number"
                          value={formData.weight ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="0.00"
                          InputProps={{
                            startAdornment: (
                              <ShippingIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Altura (cm)"
                          name="height"
                          type="number"
                          value={formData.height ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="0.00"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Largura (cm)"
                          name="width"
                          type="number"
                          value={formData.width ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="0.00"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Profundidade (cm)"
                          name="depth"
                          type="number"
                          value={formData.depth ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="0.00"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Divider />

                    {/* ===== ESPECIFICAÇÕES ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Especificações
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Marca"
                          name="brand"
                          value={formData.brand ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="Ex: Dell"
                          InputProps={{
                            startAdornment: (
                              <StyleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                            ),
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Modelo"
                          name="model"
                          value={formData.model ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="Ex: XPS 13"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Cor"
                          name="color"
                          value={formData.color ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="Ex: Prata"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Tamanho"
                          name="size"
                          value={formData.size ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="Ex: G, M, P"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Material"
                          name="material"
                          value={formData.material ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="Ex: Alumínio"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Fabricante"
                          name="manufacturer"
                          value={formData.manufacturer ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          placeholder="Ex: Dell Inc."
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Data de Fabricação"
                          name="manufactureDate"
                          type="date"
                          value={formData.manufactureDate ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Data de Validade"
                          name="expirationDate"
                          type="date"
                          value={formData.expirationDate ?? ''}
                          onChange={handleInputChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Divider />

                    {/* ===== CATEGORIA E FORNECEDOR ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Categoria e Fornecedor
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!fieldErrors.categoryId}>
                          <InputLabel id="category-select-label">
                            <CategoryIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'middle' }} />
                            Categoria *
                          </InputLabel>
                          <Select
                            labelId="category-select-label"
                            label="Categoria *"
                            name="categoryId"
                            value={formData.categoryId ?? 0}
                            onChange={handleSelectChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value={0}>Selecione uma categoria</MenuItem>
                            {categories && categories.length > 0 ? (
                              categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                  {category.name}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>Nenhuma categoria encontrada</MenuItem>
                            )}
                          </Select>
                          {fieldErrors.categoryId && (
                            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                              {fieldErrors.categoryId}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Fornecedor</InputLabel>
                          <Select
                            label="Fornecedor"
                            name="supplierId"
                            value={formData.supplierId ?? 0}
                            onChange={handleSelectChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value={0}>Selecione um fornecedor</MenuItem>
                            {suppliers && suppliers.length > 0 ? (
                              suppliers.map((supplier) => (
                                <MenuItem key={supplier.id} value={supplier.id}>
                                  {supplier.name}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>Nenhum fornecedor encontrado</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Divider />

                    {/* ===== IMAGENS ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary" sx={{ mb: 2 }}>
                      Imagens
                    </Typography>

                    <Grid container spacing={3}>
                      {/* Coluna da Imagem Principal */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" fontWeight="500" sx={{ mb: 1 }}>
                          Imagem Principal
                        </Typography>
                        
                        {imagePreview ? (
                          <Zoom in>
                            <Box
                              sx={{
                                position: 'relative',
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: `1px solid ${theme.palette.divider}`,
                                bgcolor: 'background.paper',
                                height: '100%',
                                minHeight: 300,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {!imageLoadError ? (
                                <Box
                                  component="img"
                                  src={imagePreview}
                                  alt="Preview do produto"
                                  sx={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: 400,
                                    objectFit: 'contain',
                                    display: 'block',
                                  }}
                                  onError={() => {
                                    setImageLoadError(true);
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 4,
                                    gap: 2,
                                    color: 'text.secondary',
                                  }}
                                >
                                  <ImageIcon sx={{ fontSize: 64, opacity: 0.5 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Imagem não disponível
                                  </Typography>
                                </Box>
                              )}
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
                                  label={imageFile ? "✓ Nova imagem" : "✓ Imagem atual"}
                                  size="small"
                                  color={imageFile ? "success" : "info"}
                                  sx={{ 
                                    bgcolor: imageFile 
                                      ? alpha(theme.palette.success.main, 0.9)
                                      : alpha(theme.palette.info.main, 0.9),
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
                        ) : (
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
                              minHeight: 300,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
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
                        )}
                      </Grid>

                      {/* Coluna das Imagens Adicionais */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" fontWeight="500" sx={{ mb: 1 }}>
                          Imagens Adicionais
                        </Typography>
                        
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 3,
                            textAlign: 'center',
                            borderStyle: 'dashed',
                            borderWidth: 2,
                            borderColor: 'divider',
                            borderRadius: 3,
                            cursor: 'pointer',
                            minHeight: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
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
                            multiple
                            onChange={handleAdditionalImagesChange}
                            style={{ display: 'none' }}
                          />
                          <Stack spacing={1} alignItems="center">
                            <CloudUploadIcon sx={{ color: 'text.secondary', opacity: 0.6, fontSize: 40 }} />
                            <Typography variant="body2" color="text.secondary">
                              Clique para selecionar imagens adicionais
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Você pode selecionar múltiplas imagens
                            </Typography>
                          </Stack>
                        </Paper>

                        {/* Lista de imagens existentes */}
                        {existingImages.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Imagens existentes:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                              {existingImages.map((img) => (
                                <Chip
                                  key={img.id}
                                  label={img.isMain ? '★ Principal' : img.url.split('/').pop()?.slice(0, 20) || 'Imagem'}
                                  onDelete={() => removeExistingImage(img.id)}
                                  color={img.isMain ? 'primary' : 'default'}
                                  size="small"
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}

                        {/* Novas imagens adicionadas */}
                        {additionalImages.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="success.main">
                              Novas imagens:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                              {additionalImages.map((file, index) => (
                                <Chip
                                  key={index}
                                  label={file.name}
                                  onDelete={() => removeAdditionalImage(index)}
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* ===== ATRIBUTOS PERSONALIZADOS ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Atributos Personalizados
                    </Typography>

                    {attributes.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Atributos do produto:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                          {attributes.map((attr, index) => (
                            <Chip
                              key={index}
                              label={`${attr.key}: ${attr.value}${attr.group ? ` (${attr.group})` : ''}`}
                              onDelete={() => removeAttribute(index)}
                              color="primary"
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {showAttributeForm ? (
                      <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Novo Atributo
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Chave"
                              name="key"
                              value={newAttribute.key}
                              onChange={handleAttributeChange}
                              fullWidth
                              size="small"
                              placeholder="Ex: Processador"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Valor"
                              name="value"
                              value={newAttribute.value}
                              onChange={handleAttributeChange}
                              fullWidth
                              size="small"
                              placeholder="Ex: Intel i7"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Grupo (opcional)"
                              name="group"
                              value={newAttribute.group}
                              onChange={handleAttributeChange}
                              fullWidth
                              size="small"
                              placeholder="Ex: Especificações"
                            />
                          </Grid>
                        </Grid>
                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                          <PrimaryButton size="small" onClick={addAttribute}>
                            <AddIcon fontSize="small" /> Adicionar
                          </PrimaryButton>
                          <SecondaryButton size="small" onClick={() => setShowAttributeForm(false)}>
                            Cancelar
                          </SecondaryButton>
                        </Stack>
                      </Paper>
                    ) : (
                      <PrimaryButton
                        variant="outlined"
                        onClick={() => setShowAttributeForm(true)}
                        startIcon={<AddIcon />}
                        size="small"
                      >
                        Adicionar Atributo
                      </PrimaryButton>
                    )}

                    <Divider />

                    {/* ===== OBSERVAÇÕES ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Observações
                    </Typography>

                    <TextField
                      label="Observações Internas"
                      name="observations"
                      value={formData.observations ?? ''}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      placeholder="Observações internas sobre o produto"
                      fullWidth
                      InputProps={{
                        sx: { borderRadius: 2 }
                      }}
                    />

                    <Divider />

                    {/* ===== STATUS ===== */}
                    <Typography variant="h6" fontWeight="600" color="primary">
                      Status
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            label="Status"
                            name="status"
                            value={formData.status || 'Draft'}
                            onChange={handleSelectChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="Draft">Rascunho</MenuItem>
                            <MenuItem value="Active">Ativo</MenuItem>
                            <MenuItem value="Inactive">Inativo</MenuItem>
                            <MenuItem value="Discontinued">Descontinuado</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Visibilidade</InputLabel>
                          <Select
                            label="Visibilidade"
                            name="visibility"
                            value={formData.visibility || 'NotVisible'}
                            onChange={handleSelectChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="NotVisible">Não Visível</MenuItem>
                            <MenuItem value="Visible">Visível</MenuItem>
                            <MenuItem value="VisibleOnApp">Visível no App</MenuItem>
                            <MenuItem value="VisibleOnBoth">Visível em Ambos</MenuItem>
                            <MenuItem value="Hidden">Oculto</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Destacar</InputLabel>
                          <Select
                            label="Destacar"
                            name="isFeatured"
                            value={formData.isFeatured ? 'true' : 'false'}
                            onChange={handleSelectChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="true">Sim</MenuItem>
                            <MenuItem value="false">Não</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Novo Produto</InputLabel>
                          <Select
                            label="Novo Produto"
                            name="isNew"
                            value={formData.isNew ? 'true' : 'false'}
                            onChange={handleSelectChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="true">Sim</MenuItem>
                            <MenuItem value="false">Não</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                          <InputLabel>Produto Digital</InputLabel>
                          <Select
                            label="Produto Digital"
                            name="isDigital"
                            value={formData.isDigital ? 'true' : 'false'}
                            onChange={handleSelectChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="true">Sim</MenuItem>
                            <MenuItem value="false">Não</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

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
                        {isSubmitting ? 'Atualizando...' : 'Atualizar Produto'}
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