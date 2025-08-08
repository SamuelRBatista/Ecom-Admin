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

import useCategory from '../../../../shared/hooks/ecom/product/useCategory';

import styles from './styles';

export default function ProductPage() {
  const { product } = useAppContext();
  const { products, loading, error, deleteProduct } = product;
  const { categories } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleOpenModal = (productId: number) => {
  setSelectedProductId(productId);
  setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
    await deleteProduct(selectedProductId!);
      window.location.reload(); 
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
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
  
  const enrichedProducts = useMemo(() => {
    debugger
    return products.map((product) => {
      const category = categories.find((c) => c.id === product.categoryId);
      return {
        ...product,
        categoryName: category ? category.name : 'Sem categoria',
      };
    });
  }, [products, categories]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'description', headerName: 'Descrição', flex: 1 },
    { field: 'price', headerName: 'Preço', flex: 1 },
    { field: 'sku', headerName: 'Sku', flex: 1 },
    { field: 'barCode', headerName: 'Código de Barras', flex: 1 },
    { field: 'imageUrl', headerName: 'Imagem', flex: 1 },
    { field: 'categoryName', headerName: 'Categoria', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/product/editar/${params.row.id}`} style={styles.actionIcon}>
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          <Link to={`/product/detalhes/${params.row.id}`} style={styles.actionIcon}>
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

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>Erro ao carregar produtos.</p>;

  return (
    <SidebarLayout isCollapsed={false}>
        <div style={styles.content}>
          <div style={styles.recentOrders}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Produtos</h2>
              <Link to="/register/product" style={styles.btnNew}>Novo Produto</Link>
            </div>
            <Box sx={{ height: 500, width: '100%', mt: 4 }}>
              <DataGrid
                rows={enrichedProducts}
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
            message="Tem certeza de que deseja excluir este produto? Esta ação é irreversível."
            onConfirm={handleDelete}
            onCancel={handleCancel}
          />
        </div>
    </SidebarLayout>
    
  );
}
