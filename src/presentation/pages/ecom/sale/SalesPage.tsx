import React, { useEffect, useState } from 'react';
import SidebarLayout from '../../../layouts/components/SidebarLayout';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';
import { sellProduct, getMovements } from '../../../../infrastructure/services/ecom/sale/SaleService';
import {
  Autocomplete,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
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

export default function SalesPage() {
  const productService = new ProductService();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('Venda');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [snack, setSnack] = useState<{ open: boolean; severity: 'success' | 'error' | 'info'; message: string }>({ open: false, severity: 'info', message: '' });

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
        // API may wrap results in { value: [...] } depending on serialization
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
      // refresh products and movements
      const [updatedProducts, m] = await Promise.all([productService.getAll(), getMovements(selectedProduct.id, 50)]);
      setProducts(updatedProducts || []);
      setMovements(Array.isArray(m) ? m : m?.value ?? []);
      // update selected product object with refreshed data
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

  return (
    <SidebarLayout isCollapsed={false}>
      <Paper sx={{ p: 3, m: 3 }} elevation={2}>
        <Typography variant="h5" gutterBottom>
          Vendas
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Autocomplete
              sx={{ width: '100%' }}
              options={products}
              getOptionLabel={(option: any) => `${option.name} — R$ ${option.price?.toFixed?.(2) ?? option.price} (Estoque: ${option.stockQuantity ?? 0})`}
              value={selectedProduct}
              onChange={(e, v) => setSelectedProduct(v)}
              renderInput={(params) => <TextField {...params} label="Produto" variant="outlined" fullWidth />}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              label="Quantidade"
              type="number"
              inputProps={{ min: 1 }}
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField label="Motivo" fullWidth value={reason} onChange={(e) => setReason(e.target.value)} />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button variant="contained" color="primary" fullWidth onClick={handleSell} disabled={!selectedProduct || loading} startIcon={loading ? <CircularProgress size={18} /> : null}>
              Registrar
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField label="Documento (opcional)" fullWidth value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 3 }}>Movimentações recentes</Typography>

        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Qtd</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Usuário</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>Nenhuma movimentação</TableCell>
              </TableRow>
            )}
            {movements.map((m: any) => (
              <TableRow key={m.id}>
                <TableCell>{m.createdAt ? new Date(m.createdAt).toLocaleString() : '-'}</TableCell>
                <TableCell>{typeNames[m.type] ?? m.type}</TableCell>
                <TableCell>{m.quantity}</TableCell>
                <TableCell>{m.reason}</TableCell>
                <TableCell>{m.documentNumber ?? '-'}</TableCell>
                <TableCell>{m.userName ?? m.userId ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Paper>
    </SidebarLayout>
  );
}
