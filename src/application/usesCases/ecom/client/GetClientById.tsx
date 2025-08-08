import type { IClientRepository } from '../../../../domain/repositories/ecom/client/IClientRepository';
import type { Client } from '../../../../domain/entities/ecom/client/Client';

export class GetClientById {
  constructor(private repo: IClientRepository) {}

  async execute(id: number): Promise<Client | null> {
    try {
      const client = await this.repo.getById(id);
      return client ?? null;
    } catch (error) {
        console.error('Erro ao buscar cliente por ID:', error);
      return null;
    }
  }
}
