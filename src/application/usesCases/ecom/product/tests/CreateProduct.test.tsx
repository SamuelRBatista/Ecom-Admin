import { CreateProduct } from "../CreateProduct";
import type { IProductRepository } from "../../../../../domain/repositories/ecom/product/IProductRepository";
import type { Product } from "../../../../../domain/entities/ecom/product/Product";

describe('CreateProduct Use Case', () => {
    let repo: jest.Mocked<IProductRepository>;
    let createProduct: CreateProduct;

    beforeEach(() => {
        repo = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<IProductRepository>;

        createProduct = new CreateProduct(repo);
    });

    it('Deve criar um produto com sucesso', async () => {
        const mockupProduct: Product = {
            id: 1,
            name: 'Produto Teste 1',
            description: 'Descrição do Produto Teste 1',
            price: 99.99,
            sku: 'Sku1',
            barCode: '1234567890123',   
            imageUrl:'imageTest',
            categoryId: 1,
        }; 

        const formData = new FormData();
        formData.append('name', mockupProduct.name);

        repo.create.mockResolvedValue(mockupProduct);
        const result = await createProduct.execute(formData);

        expect(repo.create).toHaveBeenCalledWith(formData);
        expect(result).toEqual(mockupProduct);  
    });
});