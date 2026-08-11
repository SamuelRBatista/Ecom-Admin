// src/presentation/pages/DashboardPage.tsx
import { useAppContext } from '../../shared/contexts/ContextProvider';
import SidebarLayout from '../../presentation/layouts/components/SidebarLayout';
import { Box, Paper, Typography, Stack, Skeleton } from '@mui/material';
import { Users, Package, Truck } from 'lucide-react';

export default function DashboardPage() {
  const { client, product, supplier } = useAppContext();

  const cards = [
    {
      title: 'Clientes',
      value: client.clients?.length || 0,
      icon: Users,
      bgColor: '#3B82F6',
      link: '/clientes',
      loading: client.loading,
    },
    {
      title: 'Produtos',
      value: product.products?.length || 0,
      icon: Package,
      bgColor: '#F59E0B',
      link: '/produtos',
      loading: product.loading,
    },
    {
      title: 'Fornecedores',
      value: supplier.suppliers?.length || 0,
      icon: Truck,
      bgColor: '#EF4444',
      link: '/fornecedores',
      loading: supplier.loading,
    },
  ];

  const hasError = !!(client.error || product.error || supplier.error);

  return (
    <SidebarLayout isCollapsed={false}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
            📊 Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mt: 0.5 }}>
            {new Date().toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Typography>
        </Box>

        {/* Error */}
        {hasError && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: '#DC2626' }}>
              ⚠️ Erro ao carregar dados. Tente novamente.
            </Typography>
          </Paper>
        )}

        {/* 3 Cards lado a lado com Stack */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ mb: 3 }}
        >
          {cards.map((card, index) => (
            <Paper
              key={index}
              onClick={() => (window.location.href = card.link)}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 3,
                bgcolor: card.bgColor,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 12px ${card.bgColor}40`,
                '&:hover': {
                  boxShadow: `0 8px 24px ${card.bgColor}60`,
                  transform: 'translateY(-4px)',
                },
                '&:hover .card-icon': {
                  transform: 'scale(1.1) rotate(6deg)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: 500,
                    }}
                  >
                    {card.title}
                  </Typography>
                  {card.loading ? (
                    <Skeleton
                      variant="text"
                      width={60}
                      height={40}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', mt: 0.5 }}
                    />
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#FFFFFF',
                        mt: 0.5,
                      }}
                    >
                      {card.value}
                    </Typography>
                  )}
                </Box>
                <Box
                  className="card-icon"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <card.icon size={24} style={{ color: '#FFFFFF' }} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* Rodapé */}
        <Box
          sx={{
            textAlign: 'center',
            pt: 2,
            borderTop: '1px solid #E5E7EB',
          }}
        >
          <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </Typography>
        </Box>
      </Box>
    </SidebarLayout>
  );
}