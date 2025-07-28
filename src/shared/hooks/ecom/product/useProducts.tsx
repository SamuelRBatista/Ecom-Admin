import { useState, useEffect } from 'react';
import type { Product } from '../../../../domain/entities/ecom/product/Product';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null); // tipo seguro

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const service = new ProductService();
        const data = await service.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}
