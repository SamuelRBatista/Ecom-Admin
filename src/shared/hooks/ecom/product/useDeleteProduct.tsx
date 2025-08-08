import { useState } from 'react';
import { DeleteProduct } from '../../../../application/usesCases/ecom/product/DeleteProduct';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';

const productService = new ProductService();

export function useDeleteProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new DeleteProduct(productService);
      await useCase.execute(id);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir produto');
      setLoading(false);
      throw err;
    }
  };

  return { deleteProduct, loading, error };
}
