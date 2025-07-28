import type { IProductRepository } from '../../../../domain/repositories/ecom/product/IProductRepository';

export class GetAllProducts {
  constructor(public repo: IProductRepository) {}

  async execute() {
    return this.repo.getAll();
  }
}
