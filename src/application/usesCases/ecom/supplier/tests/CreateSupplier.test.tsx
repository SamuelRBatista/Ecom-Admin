import { CreateSupplier } from "../CreateSupplier";
import { ISupplierRepository } from "../../../../../domain/repositories/ecom/supplier/ISupplierRepository";
import { Supplier } from "../../../../../domain/entities/ecom/supplier/Supplier";


describe('CreateSupplier Use Case', () => {
    let repo: jest.Mocked<ISupplierRepository>;
    let createSupplier: CreateSupplier;

    beforeEach(() => {
        repo = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<ISupplierRepository>;

        createSupplier = new CreateSupplier(repo);
    });

    it('Deve criar um fornecedor com sucesso', async () => {
        const mockupSupplier: Supplier = {
            id: 0,
            cnpj: '12345678901234',
            name: 'Fornecedor Teste 1',            
            email:'meuemail@gmail.com',
            phoneNumber:'99-9999999',
            address:' ABC Client 1',
            neighborhood:'ABC Client 1',
            zipCode:'99999999',
            stateId:1,
            cityId:1,
        }
        const createdSupplier: Supplier = { ...mockupSupplier, id: 1 };

        repo.create.mockResolvedValue(createdSupplier);
        const result = await createSupplier.execute(mockupSupplier);

        expect(repo.create).toHaveBeenCalledWith(mockupSupplier);
        expect(result).toEqual(createdSupplier);
    });
}); 




 