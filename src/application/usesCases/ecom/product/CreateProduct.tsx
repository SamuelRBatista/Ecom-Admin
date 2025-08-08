import type { IProductRepository } from '../../../../domain/repositories/ecom/product/IProductRepository';
import type { Product } from '../../../../domain/entities/ecom/product/Product';

export class CreateProduct {
  constructor(private repo: IProductRepository) {}

  async execute(formData: FormData): Promise<Product> {
    return this.repo.create(formData);
  }
}