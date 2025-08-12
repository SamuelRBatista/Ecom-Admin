import { DeleteSupplier } from '../DeleteSupplier';
import type { ISupplierRepository } from '../../../../../domain/repositories/ecom/supplier/ISupplierRepository';

describe('DeleteSupplier UseCase', () => {
  let mockRepo: jest.Mocked<ISupplierRepository>;
  let deleteSupplier: DeleteSupplier;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getById: jest.fn(),
    } as unknown as jest.Mocked<ISupplierRepository>;

    deleteSupplier = new DeleteSupplier(mockRepo);
  });

  it('deve deletar um supplier pelo ID', async () => {
    mockRepo.delete.mockResolvedValue();

    await deleteSupplier.execute(5);

    expect(mockRepo.delete).toHaveBeenCalledWith(5);
  });
});
