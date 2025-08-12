import { GetProductById } from "../GetProductById";
import { IProductRepository } from "../../../../../domain/repositories/ecom/product/IProductRepository";
import type { Product } from "../../../../../domain/entities/ecom/product/Product";

describe( 'GetProductById UseCase', () => {
      let repo : jest.Mocked<IProductRepository>;
      let getProductById : GetProductById;

        beforeEach(() => {
            repo = {
                getAll:jest.fn(),
                getById:jest.fn(),
                create:jest.fn(),
                update:jest.fn(),
                delete:jest.fn(),
            } as unknown as jest.Mocked<IProductRepository>;
            getProductById = new GetProductById(repo);
        });

        it('deve retornar o produto se existir', async () => {
            const mockProducts : Product = {
                id:10,
                name:'Produto Encontrado 1',
                description:'Produto encontrado test 1',
                price:200.00,
                sku:'Sku1',
                barCode:'Bar10',
                imageUrl:'imageTest1',
                categoryId:2,              
            };

            repo.getById.mockResolvedValue(mockProducts);

            const result = await getProductById.execute(10);

            expect(repo.getById).toHaveBeenCalledWith(10);
            expect(result).toEqual(mockProducts);
        });

        it('deve retornar null se ocorrer erro', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            repo.getById.mockRejectedValue(new Error('Erro de conexao'));

            const result = await getProductById.execute(99);

            expect(result).toBeNull();
            consoleSpy.mockRestore();
        });      
});