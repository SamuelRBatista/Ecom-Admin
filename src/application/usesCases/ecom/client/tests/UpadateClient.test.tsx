import { UpdateClient } from '../UpdateClient';
import { IClientRepository } from '../../../../../domain/repositories/ecom/client/IClientRepository';
import { Client } from '../../../../../domain/entities/ecom/client/Client';

describe('UpdateClient UseCase', () => {
  let repo: jest.Mocked<IClientRepository>;
  let updateClient: UpdateClient;

  beforeEach(() => {
    repo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IClientRepository>;

    updateClient = new UpdateClient(repo);
  });

  it('deve atualizar um cliente com sucesso', async () => {
    const clientToUpdate: Client = {
      id: 1,
      name: 'Cliente Atualizado',
      cpf: '123.456.789-00',
      email: 'atualizado@exemplo.com',
      phoneNumber: '(11) 98888-7777',
      address: 'Rua Atualizada, 321',
      neighborhood: 'Bairro Atualizado',
      zipCode: '87654-321',
      stateId: 1,
      cityId: 1,
    };

    // Mock para simular que a atualização não retorna nada (Promise<void>)
    repo.update.mockResolvedValue();

    await updateClient.execute(clientToUpdate);

    expect(repo.update).toHaveBeenCalledWith(clientToUpdate);
  });
});
