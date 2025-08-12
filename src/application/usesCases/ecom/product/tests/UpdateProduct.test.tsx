import { UpdateProduct } from "../UpdateProduct";
import { IProductRepository } from "../../../../../domain/repositories/ecom/product/IProductRepository";

describe('UpdateProduct Use Case', () => {
    let repo: jest.Mocked<IProductRepository>;
    let updateProduct : UpdateProduct;

    beforeEach(() => {
        repo = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),      
        } as unknown as jest.Mocked<IProductRepository>;

        updateProduct  = new UpdateProduct (repo);

    });

     it('Deve autualizar um produto com sucesso', async () => {
        const mockupProduct = {
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
        formData.append('id', '1');
        formData.append('name', mockupProduct.name);

       repo.update.mockResolvedValue();

       await updateProduct.execute(formData);

       expect(repo.update).toHaveBeenCalledWith(formData);
    });
});