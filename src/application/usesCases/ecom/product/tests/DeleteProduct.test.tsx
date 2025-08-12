import { DeleteProduct } from '../DeleteProduct';
import type { IProductRepository } from '../../../../../domain/repositories/ecom/product/IProductRepository';

describe('DeleteProduct UseCase', () => {
  let mockRepo: jest.Mocked<IProductRepository>;
  let deleteProduct: DeleteProduct;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getById: jest.fn(),
    } as unknown as jest.Mocked<IProductRepository>;

    deleteProduct = new DeleteProduct(mockRepo);
  });

  it('deve deletar um produto pelo ID', async () => {
    mockRepo.delete.mockResolvedValue();

    await deleteProduct.execute(5);

    expect(mockRepo.delete).toHaveBeenCalledWith(5);
  });
});
