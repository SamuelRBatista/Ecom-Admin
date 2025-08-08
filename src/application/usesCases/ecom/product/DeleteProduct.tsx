import type { IProductRepository } from '../../../../domain/repositories/ecom/product/IProductRepository';

export class DeleteProduct {
  constructor(private repo: IProductRepository) {}

  async execute(id: number): Promise<void> {
    
    return this.repo.delete(id);
  }
}
