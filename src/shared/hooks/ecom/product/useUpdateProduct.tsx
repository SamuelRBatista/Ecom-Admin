import { useState } from 'react';
import { UpdateProduct } from '../../../../application/usesCases/ecom/product/UpdateProduct';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';

const productService = new ProductService();

export function useUpdateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new UpdateProduct(productService);
      await useCase.execute(formData);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar produto');
      setLoading(false);
      throw err;
    }
  };

  return { updateProduct, loading, error };
}
