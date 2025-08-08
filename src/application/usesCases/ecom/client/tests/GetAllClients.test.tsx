import { GetAllClients } from "../GetAllClients";
import { IClientRepository } from "../../../../../domain/repositories/ecom/client/IClientRepository";
import { Client } from "../../../../../domain/entities/ecom/client/Client";

describe('GetAllClients Use Case', () => {
    let repo : IClientRepository;
    let getAllClients: GetAllClients;

    beforeEach(() =>{
        repo = {
            getAll:jest.fn(),
            getById:jest.fn(),
            create:jest.fn(),
            update:jest.fn(),
            delete:jest.fn(),
        }

        getAllClients = new GetAllClients(repo);
    })

    it('Deve retornar uma lista de clientes', async () => {
        const mockClients : Client[] = [
        {
            id: 1,
            name: 'Client test',
            cpf: '1234567891231',
            email:'meuemail@gmail.com',
            phoneNumber:'99-9999999',
            address:' ABC Client 1',
            neighborhood:'ABC Client 1',
            zipCode:'99999999',
            stateId:1,
            cityId:1,
        },
        {
            id: 2,
            name: 'Client test 2',
            cpf: '1234567891231',
            email:'meuemail@gmail.com',
            phoneNumber:'99-9999999',
            address:' ABC Client 2',
            neighborhood:'ABC Client 2',
            zipCode:'99999999',
            stateId:2,
            cityId:2,
        },  
    ];
        (repo.getAll as jest.Mock).mockResolvedValue(mockClients);

        const result = await getAllClients.execute();

        expect(repo.getAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockClients);
    });

    it('Deve propagar o erro se repo.getAll falhar', async () => {
        const error = new Error('Falha na consulta');
        (repo.getAll as jest.Mock).mockRejectedValueOnce(error);

           await expect(getAllClients.execute()).rejects.toThrow('Falha na consulta');
    });
});
