import type { IClientRepository } from '../../../../domain/repositories/ecom/client/IClientRepository';
import type { Client } from '../../../../domain/entities/ecom/client/Client';

export class CreateClient {
  constructor(private repo: IClientRepository) {}

  async execute(client: Client): Promise<Client> {
    return this.repo.create(client);
  }
}
