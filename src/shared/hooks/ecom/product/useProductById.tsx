import { useState } from 'react';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';
import { GetProductById } from '../../../../application/usesCases/ecom/product/GetProductById';
import type { Product } from '../../../../domain/entities/ecom/product/Product';

export function useProductById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProductById = async (id: number): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const service = new ProductService();
      const getProductByIdUseCase = new GetProductById(service);
      const client = await getProductByIdUseCase.execute(id);
      return client;
    } catch (e) {
      setError('Erro ao buscar cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getProductById, loading, error };
}
