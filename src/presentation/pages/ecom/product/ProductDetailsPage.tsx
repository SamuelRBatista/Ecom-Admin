import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './styles';
import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import type { Product } from '../../../../domain/entities/ecom/product/Product';
import useCategory from '../../../../shared/hooks/ecom/product/useCategory';
import SidebarLayout from '../../../layouts/components/SidebarLayout';

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product } = useAppContext();
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { categories } = useCategory();
 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
    
        const d = await product.getProductById(Number(id));
        setProductData(d);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Carregando detalhes...</p>;
  if (!productData) return <p>Produto não encontrado.</p>;

  const category = categories.find((c) => c.id === productData.categoryId);

  return (
    <SidebarLayout isCollapsed={false}>
      <div style={styles.cadastroFormContainer}>
      <h2 style={styles.title}>Detalhes do Produto</h2>

      <div style={styles.formRow}>
        <label>Nome:</label>
        <span>{productData.name}</span>

        <label>Descrição:</label>
        <span>{productData.description}</span>
      </div>

      <div style={styles.formRow}>
        <label>Preço:</label>
        <span>{productData.price}</span>

        <label>SKU:</label>
        <span>{productData.sku}</span>

        <label>Código de Barras:</label>
        <span>{productData.barCode}</span>
      </div>

      <div style={styles.formRow}>
        <label>Categoria:</label>
        <span>{category ? category.name : 'Sem categoria'}</span>
      </div>

      <div style={styles.formRow}>
        <button
          type="button"
          onClick={() => navigate('/panel/product')}
          style={styles.btnCancel}
        >
          Voltar
        </button>
      </div>
    </div>
    </SidebarLayout>
    
  );
};

export default ProductDetailsPage;
