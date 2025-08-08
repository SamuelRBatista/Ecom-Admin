import { GetAllProducts } from "../GetAllProducts";
import type { IProductRepository } from "../../../../../domain/repositories/ecom/product/IProductRepository";
import type { Product } from "../../../../../domain/entities/ecom/product/Product";

describe('GetAllProducts Use Case', () => {
    let repo : IProductRepository;
    let getAllProducts : GetAllProducts;

    beforeEach(() => {
        repo = {
            getAll:jest.fn(),
            getById:jest.fn(),
            create:jest.fn(),
            update:jest.fn(),
            delete:jest.fn(),
        }

        getAllProducts = new GetAllProducts(repo);     
    });

    it(' Deve retornar uma lista de produtos', async () => {
        const mockProducts : Product[] = [
         {
            id: 1,
            name: 'Product test 1',
            description: 'Descrição test 1',
            price: 100.00,
            sku:'SKU test 1',
            barCode: 'BarCode test 1',
            imageUrl: '',
            categoryId:1,                
         },
         {
            id: 2,
            name: 'Product test 2',
            description: 'Descrição test 2',
            price: 300.00,
            sku:'SKU test 2',
            barCode: 'BarCode test 2',
            imageUrl: '',
            categoryId:2,                
         },
        ];
        
        (repo.getAll as jest.Mock).mockResolvedValue(mockProducts);

        const result = await getAllProducts.execute();

        expect(repo.getAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockProducts);
    });

    it('Deve propagar erro se repo.getAll falhar', async () => {
        const error = new  Error('Falha na consulta');
        (repo.getAll as jest.Mock).mockRejectedValue(error);

        await expect(getAllProducts.execute()).rejects.toThrow('Falha na consulta');
    });
});