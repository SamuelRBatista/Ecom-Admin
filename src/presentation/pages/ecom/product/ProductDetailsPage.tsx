import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Skeleton,
  Stack,
  alpha,
  useTheme,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Numbers as NumbersIcon,
  QrCodeScanner as BarcodeIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  ExpandMore as ExpandMoreIcon,
  LocalShipping as ShippingIcon,
  Style as StyleIcon,
  CalendarToday as CalendarIcon,
  Store as StoreIcon,
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  StarOutline as StarOutlineIcon,
  Visibility as VisibilityIcon,
  Label as LabelIcon,
  Notes as NotesIcon,
  AddPhotoAlternate as AddPhotoIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';

import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import type { Product } from '../../../../domain/entities/ecom/product/Product';
import useCategory from '../../../../shared/hooks/ecom/product/useCategory';
import { useSupplier } from '../../../../shared/hooks/ecom/supplier/useSuppliers';
import { useToast } from '../../../../shared/hooks/useToast';
import SidebarLayout from '../../../layouts/components/SidebarLayout';
import { SecondaryButton, PrimaryButton, ToastContainer } from '../../../components/shared';

const ProductDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { product } = useAppContext();
  const { categories } = useCategory();
  const { suppliers } = useSupplier();
  const { toasts, removeToast, error: showToastError, success: showToastSuccess } = useToast();

  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const d = await product.getProductById(Number(id));
        setProductData(d);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        showToastError('Erro ao carregar os detalhes do produto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, product, showToastError]);

  const handleEdit = () => {
    navigate(`/panel/product/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!productData) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o produto "${productData.name}"?`)) {
      try {
        setDeleting(true);
        await product.deleteProduct(productData.id);
        showToastSuccess('Produto excluído com sucesso! 🗑️');
        setTimeout(() => {
          navigate('/panel/product');
        }, 1500);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showToastError('Erro ao excluir o produto');
        setDeleting(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/panel/product');
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Get category name
  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || 'Sem categoria';
  };

  // Get supplier name
  const getSupplierName = (supplierId?: number) => {
    if (!supplierId) return 'Não informado';
    const supplier = suppliers?.find((s) => s.id === supplierId);
    return supplier?.name || 'Não informado';
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Data inválida';
    }
  };

  // Render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} sx={{ color: '#f5a623', fontSize: 20 }} />
        ))}
        {hasHalfStar && <StarHalfIcon sx={{ color: '#f5a623', fontSize: 20 }} />}
        {[...Array(emptyStars)].map((_, i) => (
          <StarOutlineIcon key={`empty-${i}`} sx={{ color: '#f5a623', fontSize: 20 }} />
        ))}
        <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 500 }}>
          ({rating.toFixed(1)})
        </Typography>
      </Box>
    );
  };

  // Get status chip
  const getStatusChip = (status: string) => {
    const statusMap: Record<string, { label: string; color: any }> = {
      'Draft': { label: 'Rascunho', color: 'default' },
      'Active': { label: 'Ativo', color: 'success' },
      'Inactive': { label: 'Inativo', color: 'error' },
      'Discontinued': { label: 'Descontinuado', color: 'warning' },
      'PendingApproval': { label: 'Pendente', color: 'info' },
    };

    const s = statusMap[status] || { label: status, color: 'default' };
    return <Chip size="small" label={s.label} color={s.color as any} />;
  };

  // Get visibility chip
  const getVisibilityChip = (visibility: string) => {
    const visibilityMap: Record<string, { label: string; color: any }> = {
      'NotVisible': { label: 'Não Visível', color: 'default' },
      'Visible': { label: 'Visível', color: 'success' },
      'VisibleOnApp': { label: 'Visível no App', color: 'info' },
      'VisibleOnBoth': { label: 'Visível em Ambos', color: 'primary' },
      'Hidden': { label: 'Oculto', color: 'warning' },
    };

    const v = visibilityMap[visibility] || { label: visibility, color: 'default' };
    return <Chip size="small" label={v.label} color={v.color as any} variant="outlined" />;
  };

  // Loading skeleton
  if (loading) {
    return (
      <SidebarLayout isCollapsed={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" height={24} />
              </Box>
            </Box>
            <Card elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={40} />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 2 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </SidebarLayout>
    );
  }

  // Not found
  if (!productData) {
    return (
      <SidebarLayout isCollapsed={false}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Fade in>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="text.secondary" gutterBottom>
                Produto não encontrado
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                O produto que você está procurando não existe ou foi removido.
              </Typography>
              <SecondaryButton onClick={handleBack} startIcon={<ArrowBackIcon />}>
                Voltar para lista
              </SecondaryButton>
            </Box>
          </Fade>
        </Container>
      </SidebarLayout>
    );
  }

  const categoryName = getCategoryName(productData.categoryId);
  const supplierName = getSupplierName(productData.supplierId);

  return (
    <SidebarLayout isCollapsed={false}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={500}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Voltar para lista de produtos">
                <IconButton
                  onClick={handleBack}
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
                  <InfoIcon sx={{ color: theme.palette.primary.main }} />
                  Detalhes do Produto
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Visualize todas as informações do produto #{productData.id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Editar produto">
                  <IconButton
                    onClick={handleEdit}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir produto">
                  <IconButton
                    onClick={handleDelete}
                    disabled={deleting}
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      color: 'error.main',
                      '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.15) },
                    }}
                  >
                    {deleting ? <CircularProgress size={24} color="error" /> : <DeleteIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Main Card */}
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
                <Grid container spacing={4}>
                  {/* Image Section */}
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: 'grey.50',
                        border: `1px solid ${theme.palette.divider}`,
                        minHeight: 300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        flexDirection: 'column',
                      }}
                    >
                      {productData.imageUrl ? (
                        <Zoom in>
                          <Box
                            component="img"
                            src={productData.imageUrl}
                            alt={productData.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              maxHeight: 400,
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        </Zoom>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            color: 'text.secondary',
                            p: 4,
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 80, opacity: 0.3 }} />
                          <Typography variant="body2">Sem imagem</Typography>
                        </Box>
                      )}
                      <Chip
                        label={`ID: ${productData.id}`}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: alpha(theme.palette.common.black, 0.7),
                          color: 'white',
                          fontWeight: 500,
                          backdropFilter: 'blur(4px)',
                        }}
                      />

                      {/* Galeria de imagens adicionais */}
                      {productData.images && productData.images.length > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            p: 1,
                            width: '100%',
                            overflowX: 'auto',
                            bgcolor: 'background.paper',
                            borderTop: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          {productData.images
                            .filter(img => !img.isMain)
                            .slice(0, 4)
                            .map((img) => (
                              <Box
                                key={img.id}
                                component="img"
                                src={img.url}
                                alt="Imagem adicional"
                                sx={{
                                  width: 60,
                                  height: 60,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  border: `1px solid ${theme.palette.divider}`,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    borderColor: 'primary.main',
                                  },
                                }}
                              />
                            ))}
                          {productData.images.filter(img => !img.isMain).length > 4 && (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'grey.100',
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                            >
                              <AddPhotoIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Info Section */}
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Name & Status */}
                      <Box>
                        <Typography variant="h4" fontWeight="700" gutterBottom>
                          {productData.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          <Chip
                            icon={<CategoryIcon />}
                            label={categoryName}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            icon={<InventoryIcon />}
                            label={`SKU: ${productData.sku}`}
                            size="small"
                            variant="outlined"
                          />
                          {productData.barCode && (
                            <Chip
                              icon={<BarcodeIcon />}
                              label={`Código: ${productData.barCode}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {getStatusChip(productData.status || 'Draft')}
                          {getVisibilityChip(productData.visibility || 'NotVisible')}
                          {productData.isFeatured && (
                            <Chip
                              icon={<TrendingUpIcon />}
                              label="Destaque"
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                          {productData.isNew && (
                            <Chip
                              icon={<LabelIcon />}
                              label="Novo"
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          )}
                          {productData.isDigital && (
                            <Chip
                              icon={<BadgeIcon />}
                              label="Digital"
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>

                      <Divider />

                      {/* Short Description */}
                      {productData.shortDescription && (
                        <Box>
                          <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                            <DescriptionIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                            Descrição Curta
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {productData.shortDescription}
                          </Typography>
                        </Box>
                      )}

                      {/* Description */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                          <DescriptionIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                          Descrição Completa
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                          {productData.description || 'Sem descrição'}
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Price */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                          <MoneyIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                          Preços
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Typography variant="h3" color="primary" fontWeight="700">
                            {formatCurrency(productData.price)}
                          </Typography>
                          {productData.costPrice && productData.costPrice > 0 && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Preço de Custo
                              </Typography>
                              <Typography variant="body1" fontWeight="500">
                                {formatCurrency(productData.costPrice)}
                              </Typography>
                              <Typography variant="caption" color="success.main">
                                Margem: {(((productData.price - productData.costPrice) / productData.price) * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Divider />

                      {/* Additional Info Grid */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.04),
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" display="block">
                              <NumbersIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              SKU
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {productData.sku || 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.info.main, 0.04),
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" display="block">
                              <BarcodeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              Código de Barras
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {productData.barCode || 'Não informado'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.success.main, 0.04),
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" display="block">
                              <CategoryIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              Categoria
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {categoryName}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.warning.main, 0.04),
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" display="block">
                              <StoreIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              Fornecedor
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {supplierName}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.warning.main, 0.04),
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" display="block">
                              <InventoryIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              Estoque
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {productData.stockQuantity || 0} {productData.unitOfMeasure || 'UN'}
                              {productData.minimumStock && productData.minimumStock > 0 && (
                                <Chip
                                  size="small"
                                  label={`Mínimo: ${productData.minimumStock}`}
                                  sx={{ ml: 1, fontSize: '0.7rem' }}
                                />
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: alpha(theme.palette.info.main, 0.04),
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" display="block">
                              <VisibilityIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              Visibilidade
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {productData.visibility || 'Não definida'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Rating */}
                      {productData.averageRating > 0 && (
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.04),
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Avaliação Média
                            </Typography>
                            {renderStars(productData.averageRating)}
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Total de Avaliações
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {productData.totalReviews || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Total de Vendas
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {productData.totalSales || 0}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Visualizações
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {productData.viewsCount || 0}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                {/* Additional Details Accordion */}
                <Box sx={{ mt: 4 }}>
                  <Accordion sx={{ borderRadius: 2, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontWeight="600">
                        <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                        Informações Adicionais
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            {/* Dimensões */}
                            {(productData.weight || productData.height || productData.width || productData.depth) && (
                              <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500, width: '25%' }}>
                                  <ShippingIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                                  Dimensões
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {productData.weight && (
                                      <Chip label={`Peso: ${productData.weight} kg`} size="small" variant="outlined" />
                                    )}
                                    {productData.height && (
                                      <Chip label={`Altura: ${productData.height} cm`} size="small" variant="outlined" />
                                    )}
                                    {productData.width && (
                                      <Chip label={`Largura: ${productData.width} cm`} size="small" variant="outlined" />
                                    )}
                                    {productData.depth && (
                                      <Chip label={`Profundidade: ${productData.depth} cm`} size="small" variant="outlined" />
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}

                            {/* Especificações */}
                            {(productData.brand || productData.model || productData.color || productData.size || 
                              productData.material || productData.manufacturer) && (
                              <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                  <StyleIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                                  Especificações
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {productData.brand && <Chip label={`Marca: ${productData.brand}`} size="small" />}
                                    {productData.model && <Chip label={`Modelo: ${productData.model}`} size="small" />}
                                    {productData.color && <Chip label={`Cor: ${productData.color}`} size="small" />}
                                    {productData.size && <Chip label={`Tamanho: ${productData.size}`} size="small" />}
                                    {productData.material && <Chip label={`Material: ${productData.material}`} size="small" />}
                                    {productData.manufacturer && <Chip label={`Fabricante: ${productData.manufacturer}`} size="small" />}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}

                            {/* Datas */}
                            {(productData.manufactureDate || productData.expirationDate) && (
                              <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                  <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                                  Datas
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {productData.manufactureDate && (
                                      <Chip label={`Fabricação: ${formatDate(productData.manufactureDate)}`} size="small" variant="outlined" />
                                    )}
                                    {productData.expirationDate && (
                                      <Chip 
                                        label={`Validade: ${formatDate(productData.expirationDate)}`} 
                                        size="small" 
                                        color={new Date(productData.expirationDate) < new Date() ? 'error' : 'default'}
                                        variant={new Date(productData.expirationDate) < new Date() ? 'filled' : 'outlined'}
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}

                            {/* Atributos personalizados */}
                            {productData.attributes && productData.attributes.length > 0 && (
                              <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                  <LabelIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                                  Atributos
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {productData.attributes.map((attr, index) => (
                                      <Chip
                                        key={index}
                                        label={`${attr.key}: ${attr.value}`}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                      />
                                    ))}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}

                            {/* Observações */}
                            {productData.observations && (
                              <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                  <NotesIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                                  Observações
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {productData.observations}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}

                            {/* SEO */}
                            {(productData.slug || productData.metaTitle || productData.metaDescription) && (
                              <TableRow>
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                  <VisibilityIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                                  SEO
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                    {productData.slug && (
                                      <Typography variant="body2">
                                        <strong>Slug:</strong> {productData.slug}
                                      </Typography>
                                    )}
                                    {productData.metaTitle && (
                                      <Typography variant="body2">
                                        <strong>Meta Title:</strong> {productData.metaTitle}
                                      </Typography>
                                    )}
                                    {productData.metaDescription && (
                                      <Typography variant="body2">
                                        <strong>Meta Description:</strong> {productData.metaDescription}
                                      </Typography>
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}

                            {/* Auditoria */}
                            <TableRow>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                <DateRangeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 16 }} />
                                Auditoria
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                  <Typography variant="body2">
                                    <strong>Criado em:</strong> {formatDate(productData.createdAt)}
                                  </Typography>
                                  {productData.updatedAt && (
                                    <Typography variant="body2">
                                      <strong>Atualizado em:</strong> {formatDate(productData.updatedAt)}
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                </Box>

                {/* Actions */}
                <Divider sx={{ my: 4 }} />
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent="flex-end"
                >
                  <SecondaryButton
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Voltar
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleEdit}
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Editar Produto
                  </PrimaryButton>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </SidebarLayout>
  );
};

export default ProductDetailsPage;