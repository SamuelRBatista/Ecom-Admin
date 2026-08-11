import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Stack,
  Paper,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Edit, Info, Trash2, Plus } from 'lucide-react';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import {
  ConfirmModal,
  DataTable,
  PrimaryButton,
} from '../../../components/shared';

import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import useCategory from '../../../../shared/hooks/ecom/product/useCategory';
import { ErrorHandler } from '../../../../shared/helpers/ErrorHandler';
import { FormatHelper } from '../../../../shared/helpers/FormatHelper';
import { colors } from '../../../themes/theme';

export default function ProductPage() {
  const { product } = useAppContext();
  const { products, loading, error, deleteProduct } = product;
  const { categories } = useCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  const handleOpenModal = useCallback((productId: number) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
    setDeleteError(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedProductId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProductId);
      setIsModalOpen(false);
      setSelectedProductId(null);
    } catch (err) {
      setDeleteError(ErrorHandler.formatErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }, [selectedProductId, deleteProduct]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProductId(null);
    setDeleteError(null);
  }, []);

  const enrichedProducts = useMemo(() => {
    return products.map((prod) => {
       console.log("Produto:", prod.name);
    console.log("categoryId do produto:", prod.categoryId, typeof prod.categoryId);
      const category = categories.find((c) => c.id === prod.categoryId);
      return {
        ...prod,
        categoryName: category?.name || 'Sem categoria',
        priceFormatted: FormatHelper.formatCurrency(prod.price),
      };
    });
  }, [products, categories]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1, minWidth: 150 },
    {
      field: 'description',
      headerName: 'Descrição',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{FormatHelper.truncate(params.value || '', 50)}</span>
        </Tooltip>
      ),
    },
    {
      field: 'priceFormatted',
      headerName: 'Preço',
      flex: 0.1,
      minWidth: 100,
    },
    { field: 'sku', headerName: 'SKU', flex: 0.1, minWidth: 100 },
    { field: 'categoryName', headerName: 'Categoria', flex:0.5, minWidth: 120 },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.3,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar">
            <Link to={`/product/editar/${params.row.id}`}>
              <IconButton size="small" color="primary">
                <Edit size={18} />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Detalhes">
            <Link to={`/product/detalhes/${params.row.id}`}>
              <IconButton size="small" color="info">
                <Info size={18} />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Deletar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleOpenModal(params.row.id)}
            >
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <SidebarLayout isCollapsed={false}>
      <Box sx={{ padding: '20px' }}>
        <Paper
          sx={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              py: 2,
              backgroundColor: colors.background,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <Typography variant="h2" sx={{ color: colors.primary }}>
              Produtos
            </Typography>
            <Link to="/register/product" style={{ textDecoration: 'none' }}>
              <PrimaryButton startIcon={<Plus size={20} />}>
                Novo Produto
              </PrimaryButton>
            </Link>
          </Box>

          {/* Content */}
          <Box sx={{ padding: '1px' }}>
            <DataTable
              columns={columns}
              rows={enrichedProducts}
              loading={loading}
              error={error ? ErrorHandler.formatErrorMessage(error) : null}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25]}
            />
          </Box>
        </Paper>

        {/* Delete Modal */}
        <ConfirmModal
          open={isModalOpen}
          title="Confirmar Exclusão"
          message={
            deleteError
              ? `Erro ao deletar: ${deleteError}`
              : 'Tem certeza que deseja deletar este produto? Esta ação é irreversível.'
          }
          onConfirm={handleDelete}
          onCancel={handleCancel}
          loading={isDeleting}
          confirmText="Deletar"
          isDangerous={true}
        />
      </Box>
    </SidebarLayout>
  );
}
