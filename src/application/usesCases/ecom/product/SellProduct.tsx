import type { IProductRepository } from '../../../../domain/repositories/ecom/product/IProductRepository';

export class SellProduct {
  constructor(private repo: IProductRepository) {}

  async execute(id: number, quantity: number): Promise<void> {
    return this.repo.sell(id, quantity);
  }
}
