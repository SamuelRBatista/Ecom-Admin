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
import { ErrorHandler } from '../../../../shared/helpers/ErrorHandler';
import { colors } from '../../../themes/theme';
import {useCities} from '../../../../shared/hooks/ecom/locality/useCities';
import {useStates} from '../../../../shared/hooks/ecom/locality/useStates';

export default function SuppliePage() {
  const { supplier } = useAppContext();
  const { suppliers, loading, error, deleteSupplier } = supplier; 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const { cities } = useCities();
  const { states } = useStates();

  const handleOpenModal = (supplierId: number) => {
    setSelectedSupplierId(supplierId);
    setIsModalOpen(true);
    setDeleteError(null);
  };

   const handleDelete = useCallback(async () => {
      if (!selectedSupplierId) return;
      setIsDeleting(true);
      try {
        await deleteSupplier(selectedSupplierId);
        setIsModalOpen(false);
        setSelectedSupplierId(null);
      } catch (err) {
        setDeleteError(ErrorHandler.formatErrorMessage(err));
      } finally {
        setIsDeleting(false);
      }
    }, [selectedSupplierId, deleteSupplier]); 

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const enrichedSuppliers = useMemo(() => {
    return suppliers.map((supplier) => {
      const city = cities.find((c) => c.id === supplier.cityId);
      const state = states.find((s) => s.id === supplier.stateId);
      return {
        ...supplier,
        cityName: city ? city.name : 'Cidade não encontrada',
        stateName: state ? `${state.name} (${state.uf})` : 'Estado não encontrado',
      };
    });
  }, [suppliers, cities, states]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'cnpj', headerName: 'Cnpj', flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1 },
    { field: 'phoneNumber', headerName: 'Telefone', flex: 1 },
    { field: 'address', headerName: 'Endereço', flex: 1 },
    { field: 'neighborhood', headerName: 'Bairro', flex: 1 },
    { field: 'zipCode', headerName: 'Cep', flex: 1 },
    { field: 'stateName', headerName: 'Estado', flex: 1 },
    { field: 'cityName', headerName: 'Cidade', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Editar">
            <Link to={`/supplier/editar/${params.row.id}`}>
              <IconButton size="small" color="primary">
                <Edit size={18} />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Detalhes">
            <Link to={`/supplier/detalhes/${params.row.id}`}>
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
              Fornecedores
              </Typography>
              <Link to="/register/supplier" style={{ textDecoration: 'none' }}>
                <PrimaryButton startIcon={<Plus size={20} />}>
                  Novo Fornecedor
                </PrimaryButton>
              </Link>          
            </Box>
            {/* Content */}
              <Box sx={{ padding: '1px' }}>
                <DataTable
                columns={columns}
                rows={enrichedSuppliers}
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
                  : 'Tem certeza que deseja deletar este fornecedor? Esta ação é irreversível.'
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
