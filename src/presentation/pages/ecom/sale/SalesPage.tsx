import { useEffect, useState } from 'react';
import SidebarLayout from '../../../layouts/components/SidebarLayout';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';
import { sellProduct, getMovements } from '../../../../infrastructure/services/ecom/sale/SaleService';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

const typeNames: Record<number, string> = {
  1: 'Entrada',
  2: 'Saída',
  3: 'Ajuste',
  4: 'Devolução',
  5: 'Transferência',
  6: 'Perda',
  7: 'Danificado',
  8: 'Reserva',
  9: 'Cancelamento',
};

const formatCurrency = (value: number | string | undefined) => {
  const numericValue = Number(value ?? 0);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

const getStockColor = (stock: number | undefined) => {
  if (stock === undefined || stock <= 0) return 'error';
  if (stock <= 5) return 'warning';
  return 'success';
};

export default function SalesPage() {
  const productService = new ProductService();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('Venda');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'error' | 'info'; message: string }>({
    open: false,
    severity: 'info',
    message: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await productService.getAll();
        setProducts(data || []);
      } catch (err) {
        setSnack({ open: true, severity: 'error', message: 'Falha ao carregar produtos.' });
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      setMovements([]);
      return;
    }

    (async () => {
      try {
        const m = await getMovements(selectedProduct.id, 50);
        setMovements(Array.isArray(m) ? m : m?.value ?? []);
      } catch (err) {
        setSnack({ open: true, severity: 'error', message: 'Falha ao buscar movimentações.' });
      }
    })();
  }, [selectedProduct]);

  const handleSell = async () => {
    if (!selectedProduct) return;
    if (quantity <= 0) {
      setSnack({ open: true, severity: 'error', message: 'Quantidade deve ser maior que zero.' });
      return;
    }
    if (selectedProduct.stockQuantity != null && quantity > selectedProduct.stockQuantity) {
      setSnack({ open: true, severity: 'error', message: 'Quantidade maior que o estoque disponível.' });
      return;
    }

    setLoading(true);
    try {
      await sellProduct(selectedProduct.id, quantity, reason, documentNumber || undefined, undefined);
      setSnack({ open: true, severity: 'success', message: 'Venda registrada com sucesso.' });

      const [updatedProducts, m] = await Promise.all([productService.getAll(), getMovements(selectedProduct.id, 50)]);
      setProducts(updatedProducts || []);
      setMovements(Array.isArray(m) ? m : m?.value ?? []);

      const refreshed = (updatedProducts || []).find((p: any) => p.id === selectedProduct.id) ?? selectedProduct;
      setSelectedProduct(refreshed);
      setQuantity(1);
      setDocumentNumber('');
    } catch (err: any) {
      const msg = err?.response?.data?.Error || err.message || 'Erro ao registrar venda';
      setSnack({ open: true, severity: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const selectedStock = selectedProduct?.stockQuantity ?? 0;
  const totalValue = Number(selectedProduct?.price ?? 0) * Number(quantity || 0);

  return (
    <SidebarLayout isCollapsed={false}>
      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100%' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%)',
            border: '1px solid rgba(25, 118, 210, 0.08)',
            boxShadow: '0 14px 32px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.5 }}>
                Operação de venda
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Vendas
              </Typography>
            </Box>

            <Chip
              label={selectedProduct ? 'Produto selecionado' : 'Nenhum produto'}
              color={selectedProduct ? 'primary' : 'default'}
              variant={selectedProduct ? 'filled' : 'outlined'}
              sx={{ px: 1, py: 0.5, borderRadius: 2, fontWeight: 600 }}
            />
          </Stack>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  backgroundColor: '#F8FAFF',
                  border: '1px solid rgba(25, 118, 210, 0.08)',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                  Produto
                </Typography>
                <Autocomplete
                  sx={{ width: '100%' }}
                  options={products}
                  getOptionLabel={(option: any) =>
                    `${option.name} — ${formatCurrency(option.price)} (Estoque: ${option.stockQuantity ?? 0})`
                  }
                  value={selectedProduct}
                  onChange={(_, v) => setSelectedProduct(v)}
                  renderInput={(params) => (
                    <TextField {...params} label="Selecione o produto" variant="outlined" fullWidth />
                  )}
                  noOptionsText="Nenhum produto encontrado"
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                />
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  backgroundColor: '#F8FAFF',
                  border: '1px solid rgba(25, 118, 210, 0.08)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Estoque atual
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {selectedProduct ? selectedStock : 0}
                  </Typography>
                  <Chip
                    label={selectedProduct ? (selectedStock <= 0 ? 'Sem estoque' : selectedStock <= 5 ? 'Baixo' : 'Normal') : 'Indefinido'}
                    color={selectedProduct ? getStockColor(selectedStock) : 'default'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              backgroundColor: '#ffffff',
              border: '1px solid rgba(15, 23, 42, 0.06)',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  label="Quantidade"
                  type="number"
                  inputProps={{ min: 1 }}
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  helperText={selectedProduct ? `Máx. ${selectedStock}` : 'Selecione um produto'}
                  error={Boolean(selectedProduct && quantity > selectedStock && selectedStock > 0)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField label="Motivo" fullWidth value={reason} onChange={(e) => setReason(e.target.value)} />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label="Documento (opcional)"
                  fullWidth
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSell}
                  disabled={!selectedProduct || loading}
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                  sx={{
                    height: 56,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  {loading ? 'Registrando...' : 'Registrar venda'}
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2.5 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.2 }}>
                  Resumo da operação
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700 }}>
                  {selectedProduct ? selectedProduct.name : 'Selecione um produto'}
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Valor estimado
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {formatCurrency(totalValue)}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              backgroundColor: '#fff',
            }}
          >
            <Box sx={{ px: 3, py: 2.5, backgroundColor: '#F8FAFF', borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Movimentações recentes
              </Typography>
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Qtd</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Motivo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Documento</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Usuário</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 3, color: 'text.secondary' }}>
                      Nenhuma movimentação para este produto.
                    </TableCell>
                  </TableRow>
                )}
                {movements.map((m: any) => (
                  <TableRow key={m.id} hover>
                    <TableCell>{m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={typeNames[m.type] ?? m.type}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          backgroundColor: m.type === 2 ? 'rgba(211, 47, 47, 0.12)' : 'rgba(25, 118, 210, 0.12)',
                          color: m.type === 2 ? 'error.main' : 'primary.main',
                        }}
                      />
                    </TableCell>
                    <TableCell>{m.quantity}</TableCell>
                    <TableCell>{m.reason}</TableCell>
                    <TableCell>{m.documentNumber ?? '-'}</TableCell>
                    <TableCell>{m.userName ?? m.userId ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Paper>

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Box>
    </SidebarLayout>
  );
}
