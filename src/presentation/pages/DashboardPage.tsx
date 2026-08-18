import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import SidebarLayout from '../layouts/components/SidebarLayout';
import { ProductService } from '../../infrastructure/services/ecom/product/ProductService';
import { ClientService } from '../../infrastructure/services/ecom/client/ClientService';
import { SupplierService } from '../../infrastructure/services/ecom/supplier/SupplierService';
import { getMovements } from '../../infrastructure/services/ecom/sale/SaleService';

const statCards = [
  { key: 'products', label: 'Produtos cadastrados', color: '#2563eb', accent: '#dbeafe' },
  { key: 'clients', label: 'Clientes', color: '#16a34a', accent: '#dcfce7' },
  { key: 'suppliers', label: 'Fornecedores', color: '#f59e0b', accent: '#fef3c7' },
  { key: 'sales', label: 'Vendas registradas', color: '#7c3aed', accent: '#ede9fe' },
] as const;

export default function DashboardPage() {
  const productService = useMemo(() => new ProductService(), []);
  const clientService = useMemo(() => new ClientService(), []);
  const supplierService = useMemo(() => new SupplierService(), []);

  const [products, setProducts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [salesCount, setSalesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [productsData, clientsData, suppliersData] = await Promise.all([
          productService.getAll(),
          clientService.getAll(),
          supplierService.getAll(),
        ]);

        if (!active) return;

        const safeProducts = Array.isArray(productsData) ? productsData : [];
        const safeClients = Array.isArray(clientsData) ? clientsData : [];
        const safeSuppliers = Array.isArray(suppliersData) ? suppliersData : [];

        setProducts(safeProducts);
        setClients(safeClients);
        setSuppliers(safeSuppliers);

        const movementsByProduct = await Promise.all(
          safeProducts.map(async (product) => {
            try {
              const result = await getMovements(product.id, 50);
              return Array.isArray(result) ? result : result?.value ?? [];
            } catch {
              return [];
            }
          })
        );

        if (!active) return;

        const totalSales = movementsByProduct
          .flat()
          .filter((movement: any) => {
            const type = Number(movement?.type);
            const reason = String(movement?.reason ?? '').trim().toLowerCase();
            return type === 2 || reason === 'venda';
          }).length;

        setSalesCount(totalSales);
      } catch {
        if (active) {
          setError('Não foi possível carregar os dados do dashboard.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [clientService, productService, supplierService]);

  const totals = useMemo(
    () => ({
      products: products.length,
      clients: clients.length,
      suppliers: suppliers.length,
      sales: salesCount,
    }),
    [clients.length, products.length, salesCount, suppliers.length]
  );

  if (loading) {
    return (
      <SidebarLayout isCollapsed={false}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary">
              Carregando dashboard...
            </Typography>
          </Stack>
        </Box>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout isCollapsed={false}>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
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
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.5 }}>
              Visão geral
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Dashboard
            </Typography>
          </Stack>

          {error ? (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid rgba(211, 47, 47, 0.15)',
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                color: 'error.main',
              }}
            >
              {error}
            </Paper>
          ) : null}

          <Grid container spacing={3}>
            {statCards.map((card) => (
              <Grid key={card.key} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid rgba(15, 23, 42, 0.06)',
                    background: `linear-gradient(135deg, ${card.accent} 0%, #ffffff 100%)`,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: card.accent,
                          color: card.color,
                          fontWeight: 800,
                          fontSize: 22,
                        }}
                      >
                        {totals[card.key as keyof typeof totals]}
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.1 }}>
                          Total
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: card.color }}>
                          {totals[card.key as keyof typeof totals]}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600, color: 'text.primary' }}>
                      {card.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </SidebarLayout>
  );
}
