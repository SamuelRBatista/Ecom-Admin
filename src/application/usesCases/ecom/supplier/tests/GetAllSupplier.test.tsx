import { ISupplierRepository } from "../../../../../domain/repositories/ecom/supplier/ISupplierRepository";
import type { Supplier } from "../../../../../domain/entities/ecom/supplier/Supplier"; 
import { GetAllSuppliers } from "../GetAllSupplier";


describe ('GetAllSupplier Use Cases', () => {
    let repo : ISupplierRepository;
    let getAllSupplier: GetAllSuppliers;

    beforeEach(() => {
        repo = {
            getAll:  jest.fn(),
            getById: jest.fn(),
            create:  jest.fn(),
            update:  jest.fn(),
            delete:  jest.fn(), 
        }

        getAllSupplier = new GetAllSuppliers(repo);
    });

    it('Deve retornar uma lista de fornecedores', async () => {
        const mockSupplier : Supplier[] = [
            {
                id:1,
                cnpj:'12.345.678/0001-95',
                name:'Fornecedor test 1',
                email:'xyz@email.com',
                phoneNumber:'(99)99999-9999',
                address:'xyz test 1',
                neighborhood:'xyz test 1',
                zipCode:'99999-999',
                stateId:1,
                cityId:1,
            },
            {
                id:2,
                cnpj:'12.345.678/0001-98',
                name:'Fornecedor test 2',
                email:'xyz@email.com',
                phoneNumber:'(99)99999-9999',
                address:'xyz test 2',
                neighborhood:'xyz test 2',
                zipCode:'99999-999',
                stateId:2,
                cityId:2,
            },
        ];

        (repo.getAll as jest.Mock).mockResolvedValue(mockSupplier);

        const result = await getAllSupplier.execute();

        expect(repo.getAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockSupplier);
    });

    it('Deve propagar o erro se repo.getAll falhar', async () => {
        const error = new Error('Falha na consulta');
        (repo.getAll as jest.Mock).mockRejectedValue(error);

        await expect(getAllSupplier.execute()).rejects.toThrow('Falha na consult');
    });

});