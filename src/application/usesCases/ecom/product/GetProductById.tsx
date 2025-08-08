import type { IProductRepository } from '../../../../domain/repositories/ecom/product/IProductRepository';
import type { Product } from '../../../../domain/entities/ecom/product/Product';

export class GetProductById {
  constructor(private repo: IProductRepository) {}

  async execute(id: number): Promise<Product | null> {
    try {
      const product = await this.repo.getById(id);
      return product ?? null;
    } catch (error) {
        console.error('Erro ao buscar producto por ID:', error);
      return null;
    }
  }
}
