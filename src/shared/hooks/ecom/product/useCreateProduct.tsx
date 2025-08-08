import { useState } from 'react';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';
import { CreateProduct } from '../../../../application/usesCases/ecom/product/CreateProduct';
import type { Product } from '../../../../domain/entities/ecom/product/Product';

export  function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (formData: FormData): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const service = new ProductService();
      const createProduct = new CreateProduct(service);
      const product = await createProduct.execute(formData);
      return product;
    } catch (e) {
      setError('Erro ao criar produto');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
