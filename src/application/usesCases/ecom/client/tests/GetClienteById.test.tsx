import { IClientRepository } from "../../../../../domain/repositories/ecom/client/IClientRepository";
import { GetClientById } from "../GetClientById";
import { Client } from "../../../../../domain/entities/ecom/client/Client";

describe('GetClientById Use Cases ', () => {
    let repo : jest.Mocked<IClientRepository>;
    let getClientById : GetClientById;

    beforeEach(() => {
        repo = {
            getAll:jest.fn(),
            getById:jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete:jest.fn(),
        } as unknown as jest.Mocked<IClientRepository>;

        getClientById = new GetClientById(repo);
    });

    it('Deve retornar o cliente se existir ', async () => {
        const mockupClients : Client = {
            id:1,
            name:'Cliente test1',
            cpf:'999.999.999-99',
            email:'xyz@email.com',
            phoneNumber:'(99)9999-999',
            address:'xyz test',
            neighborhood:'xyz t3st 1',
            zipCode:'99999-999',
            stateId:1,
            cityId:1,
        }

        repo.getById.mockResolvedValue(mockupClients);
        const result = await getClientById.execute(1);

        expect(repo.getById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockupClients);

    });

    it('deve retornar null se ocorrer erro', async () => {
        const consoleSpy = jest.spyOn(console,'error').mockImplementation(()=> {});
        repo.getById.mockRejectedValue(new Error('Erro de conexão'));

        const result = await getClientById.execute(99);

        expect(result).toBeNull();
        consoleSpy.mockRestore();
    });

})