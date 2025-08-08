import type { IClientRepository } from '../../../../domain/repositories/ecom/client/IClientRepository';

export class DeleteClient {
  constructor(private repo: IClientRepository) {}

  async execute(id: number): Promise<void> {
    
    return this.repo.delete(id);
  }
}
