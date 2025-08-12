import { ISupplierRepository } from "../../../../../domain/repositories/ecom/supplier/ISupplierRepository";
import { GetSupplierById } from "../GetSupplierById";
import { Supplier } from "../../../../../domain/entities/ecom/supplier/Supplier";

describe('GetSupplierById Use Cases', () => {
    let repo: jest.Mocked<ISupplierRepository>;
    let getSupplierById: GetSupplierById;

    beforeEach(() => {
        repo = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<ISupplierRepository>;

        getSupplierById = new GetSupplierById(repo);
    });

    it('Deve retornar o fornecedor se existir', async () => {
        const mockupSupplier: Supplier = {
            id: 1,
            cnpj: '99.999.999/0001-99',
            name: 'Fornecedor Teste 1',            
            email: 'supplier1@gmail.com',
             phoneNumber:'(99)9999-999',
            address:'xyz test',
            neighborhood:'xyz t3st 1',
            zipCode:'99999-999',
            stateId:1,
            cityId:1,
        }

        repo.getById.mockResolvedValue(mockupSupplier);
        const result = await getSupplierById.execute(1);

        expect(repo.getById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockupSupplier);
    });

    it('deve retornar null se ocorrer erro', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        repo.getById.mockRejectedValue(new Error('Erro de conexão'));

        const result = await getSupplierById.execute(99);

        expect(result).toBeNull();
        consoleSpy.mockRestore();
    });

});