import {useEffect, useState} from 'react';
import type { Product } from '../../../../domain/entities/ecom/product/Product';
import { GetAllProducts } from '../../../../application/usesCases/ecom/product/GetAllProducts';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';

export  function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const useCase = new GetAllProducts(new ProductService());
        useCase.execute()
        .then(setProducts)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }, []);

    return { products, loading, error}
}