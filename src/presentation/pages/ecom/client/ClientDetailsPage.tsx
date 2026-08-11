import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
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
  LocalOffer as LocalOfferIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import type { Client } from '../../../../domain/entities/ecom/client/Client';
import { useToast } from '../../../../shared/hooks/useToast';
import SidebarLayout from '../../../layouts/components/SidebarLayout';
import { SecondaryButton, PrimaryButton, ToastContainer } from '../../../components/shared';

const ClientDetailsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { client } = useAppContext();
  const { toasts, removeToast, error: showToastError, success: showToastSuccess } = useToast();

  const [clientData, setClientData] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const d = await client.getClientById(Number(id));
        setClientData(d);
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        showToastError('Erro ao carregar os detalhes do cliente');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id, client, showToastError]);

  const handleEdit = () => {
    navigate(`/panel/client/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!clientData) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor "${clientData.name}"?`)) {
      try {
        setDeleting(true);
        await client.deleteClient(clientData.id);
        showToastSuccess('Cliente excluído com sucesso! 🗑️');
        setTimeout(() => {
          navigate('/panel/client');
        }, 1500);
      } catch (error) {
        console.error('Erro ao excluir client:', error);
        showToastError('Erro ao excluir o client');
        setDeleting(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/panel/client');
  };

  // Format currency
  // const formatCurrency = (value: number) => {
  //   return new Intl.NumberFormat('pt-BR', {
  //     style: 'currency',
  //     currency: 'BRL',
  //   }).format(value);
  // };

   // Loading skeleton
  if (loading) {
    return (
      <SidebarLayout isCollapsed={false}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header Skeleton */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" height={24} />
              </Box>
            </Box>

            {/* Content Skeleton */}
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
  if (!clientData) {
    return (
      <SidebarLayout isCollapsed={false}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Fade in>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="text.secondary" gutterBottom>
               Cliente não encontrado
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                O cliente que você está procurando não existe ou foi removido.
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

  return (
    <SidebarLayout isCollapsed={false}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={500}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Tooltip title="Voltar para lista de cliente">
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
                  Detalhes do Cliente
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  Visualize todas as informações do cliente #{clientData.id}
                </Typography>
              </Box>
              {/* <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Editar fornecedor">
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
                <Tooltip title="Excluir fornecedor">
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
              </Box> */}
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
                      }}
                    >
                      {clientData.imageUrl ? (
                        <Zoom in>
                          <Box
                            component="img"
                            src={clientData.imageUrl}
                            alt={clientData.name}
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
                        label={`ID: ${clientData.id}`}
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
                    </Box>
                  </Grid>

                  {/* Info Section */}
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Name */}
                      <Box>
                        <Typography variant="h4" fontWeight="700" gutterBottom>
                          {clientData.cpf}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            icon={<InventoryIcon />}
                            label={`Nome: ${clientData.name}`}
                            size="small"
                            variant="outlined"
                          />
                         
                            {/* <Chip
                              icon={<BarcodeIcon />}
                              label={`Código: ${supplierData.}`}
                              size="small"
                              variant="outlined"
                            /> */}
                 
                        </Box>
                      </Box>

                      <Divider />

                      {/* Description */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                          <DescriptionIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                          Endereço
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                          {clientData.address || 'Sem enderço'}
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Price */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="600" color="text.secondary" gutterBottom>
                          <MoneyIcon sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                          Cep
                        </Typography>
                        <Typography variant="h3" color="primary" fontWeight="700">
                            {clientData.zipCode || 'Sem cep'}
                        </Typography>
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
                            Bairro
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {clientData.neighborhood || 'Sem bairro'}
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
                              Cidade
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                              {clientData.cityId || 'Não informado'}
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
                              Estado
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                               {clientData.stateId || 'Não informado'}
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
                              <InfoIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                              Status
                            </Typography>
                            <Chip
                              size="small"
                              label="Ativo"
                              color="success"
                              icon={<CheckCircleIcon />}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>

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
                  {/* <PrimaryButton
                    onClick={handleEdit}
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Editar Produto
                  </PrimaryButton> */}
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

export default ClientDetailsPage;