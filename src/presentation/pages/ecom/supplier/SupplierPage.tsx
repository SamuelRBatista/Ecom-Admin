import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfoCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import ConfirmModal from '../../../layouts/components/ConfirmModal';

import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import {useCities} from '../../../../shared/hooks/ecom/locality/useCities';
import {useStates} from '../../../../shared/hooks/ecom/locality/useStates';

import styles from './styles';

export default function SuppliePage() {
  const { supplier } = useAppContext();
  const { suppliers, loading, error, deleteSupplier } = supplier;  
  const { cities } = useCities();
  const { states } = useStates();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

  const handleOpenModal = (supplierId: number) => {
    setSelectedSupplierId(supplierId);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSupplier(selectedSupplierId!);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao excluir o fornecedor:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  
  const enrichedClients = useMemo(() => {
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/supplier/editar/${params.row.id}`} style={styles.actionIcon}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <Link to={`/supplier/detalhes/${params.row.id}`} style={styles.actionIcon}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </Link>
          <span
            style={styles.actionIconDelete}
            onClick={() => handleOpenModal(params.row.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </div>
      ),
    },
  ];

  if (loading) return <p>Carregando fornecedores...</p>;
  if (error) return <p>Erro ao carregar fornecedores.</p>;

  return (
    <SidebarLayout isCollapsed={false}>
      <div style={styles.content}>
        <div style={styles.recentOrders}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Fornecedores</h2>
            <Link to="/register/supplier" style={styles.btnNew}>Novo Fornecedor</Link>
          </div>
          <Box sx={{ height: 500, width: '100%', mt: 4 }}>
            <DataGrid
              rows={enrichedClients}
              columns={columns}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 20]}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              pagination
            />
          </Box>
        </div>
        <ConfirmModal
          isOpen={isModalOpen}
          title="Confirmar Exclusão"
          message="Tem certeza de que deseja excluir este fornecedor? Esta ação é irreversível."
          onConfirm={handleDelete}
          onCancel={handleCancel}
        />
      </div>
    </SidebarLayout>
  );
}
