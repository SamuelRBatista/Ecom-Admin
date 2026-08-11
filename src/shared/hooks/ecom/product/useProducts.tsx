import { useState, useEffect, useCallback } from 'react';

import type { Product } from '../../../../domain/entities/ecom/product/Product';

import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';

import { GetAllProducts } from '../../../../application/usesCases/ecom/product/GetAllProducts';
import { GetProductById } from '../../../../application/usesCases/ecom/product/GetProductById';
import { CreateProduct } from '../../../../application/usesCases/ecom/product/CreateProduct';
import { UpdateProduct } from '../../../../application/usesCases/ecom/product/UpdateProduct';
import { DeleteProduct } from '../../../../application/usesCases/ecom/product/DeleteProduct';
import { SellProduct } from '../../../../application/usesCases/ecom/product/SellProduct';

const service = new ProductService();

export function useProduct() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {

        setLoading(true);

        try {

            const useCase = new GetAllProducts(service);

            const data = await useCase.execute();

            setProducts(data);

            setError(null);

        } catch (err: any) {

            setError(err.message ?? 'Erro ao carregar produtos');

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadProducts();

    }, [loadProducts]);

    const createProduct = async (formData: FormData) => {

        setLoading(true);

        try {

            const useCase = new CreateProduct(service);

            const product = await useCase.execute(formData);

            await loadProducts();

            return product;

        } finally {

            setLoading(false);

        }

    };

    const updateProduct = async (formData: FormData) => {

        setLoading(true);

        try {

            const useCase = new UpdateProduct(service);

            await useCase.execute(formData);

            await loadProducts();

        } finally {

            setLoading(false);

        }

    };

    const sellProduct = async (id: number, quantity: number) => {
        setLoading(true);

        try {
            const useCase = new SellProduct(service);
            await useCase.execute(id, quantity);
            await loadProducts();
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: number) => {

        setLoading(true);

        try {

            const useCase = new DeleteProduct(service);

            await useCase.execute(id);

            await loadProducts();

        } finally {

            setLoading(false);

        }

    };

    const getProductById = async (id: number) => {

        const useCase = new GetProductById(service);

        return await useCase.execute(id);

    };

    return {

        products,

        loading,

        error,

        loadProducts,

        createProduct,

        updateProduct,

        sellProduct,

        deleteProduct,

        getProductById

    };

}