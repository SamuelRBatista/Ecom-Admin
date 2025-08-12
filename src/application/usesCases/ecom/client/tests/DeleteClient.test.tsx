import { DeleteClient } from '../DeleteClient';
import type { IClientRepository } from '../../../../../domain/repositories/ecom/client/IClientRepository';

describe('DeleteClient UseCase', () => {
  let mockRepo: jest.Mocked<IClientRepository>;
  let deleteClient: DeleteClient;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getById: jest.fn(),
    } as unknown as jest.Mocked<IClientRepository>;

    deleteClient = new DeleteClient(mockRepo);
  });

  it('deve deletar um client pelo ID', async () => {
    mockRepo.delete.mockResolvedValue();

    await deleteClient.execute(5);

    expect(mockRepo.delete).toHaveBeenCalledWith(5);
  });
});
