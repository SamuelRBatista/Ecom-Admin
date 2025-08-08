import type { IClientRepository } from '../../../../domain/repositories/ecom/client/IClientRepository';

export class GetAllClients {
  constructor(public repo: IClientRepository) {}

  async execute() {
    return this.repo.getAll();
  }
}
