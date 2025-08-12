import { CreateClient } from "../CreateClient";
import { IClientRepository } from "../../../../../domain/repositories/ecom/client/IClientRepository";
import { Client } from "../../../../../domain/entities/ecom/client/Client";

describe('CreateClient Use Case', () => {
    let repo: jest.Mocked<IClientRepository>;
    let createClient: CreateClient;

    beforeEach(() => {
        repo = {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<IClientRepository>;

        createClient = new CreateClient(repo);
    })

    it('Deve criar um cliente com sucesso', async () => {
        const mockupClient: Client = {
            id: 0,
            name: 'Client test 1',
            cpf: '1234567891231',
            email:'meuemail@gmail.com',
            phoneNumber:'99-9999999',
            address:' ABC Client 1',
            neighborhood:'ABC Client 1',
            zipCode:'99999999',
            stateId:1,
            cityId:1,
        }

         const createdClient: Client = { ...mockupClient, id: 1 };      

        repo.create.mockResolvedValue(createdClient);
        const result = await createClient.execute(mockupClient);

        expect(repo.create).toHaveBeenCalledWith(mockupClient);
        expect(result).toEqual(createdClient);
    });

});


