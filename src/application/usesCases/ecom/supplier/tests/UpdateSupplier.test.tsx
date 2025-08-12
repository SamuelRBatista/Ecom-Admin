import { UpdateSupplier } from '../UpdateSupplier';
import { ISupplierRepository } from '../../../../../domain/repositories/ecom/supplier/ISupplierRepository';
import { Supplier } from '../../../../../domain/entities/ecom/supplier/Supplier';

describe('UpdateSupplier UseCase', () => {
  let repo: jest.Mocked<ISupplierRepository>;
  let updateSupplier: UpdateSupplier;

  beforeEach(() => {
    repo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ISupplierRepository>;

    updateSupplier = new UpdateSupplier(repo);
  });

  it('deve atualizar um fornecedor com sucesso', async () => {
    const supplierToUpdate: Supplier = {
      id: 1,
      name: 'Fornecedor Atualizado',
      cnpj: '12.345.678/0001-95',
      email: 'fornecedor@exemplo.com',
      phoneNumber: '(11) 99999-8888',
      address: 'Rua do Fornecedor, 123',
      neighborhood: 'Bairro Fornecedor',
      zipCode: '12345-678',
      stateId: 1,
      cityId: 1,
    };

    repo.update.mockResolvedValue();

    await updateSupplier.execute(supplierToUpdate);

    expect(repo.update).toHaveBeenCalledWith(supplierToUpdate);
  });
});
