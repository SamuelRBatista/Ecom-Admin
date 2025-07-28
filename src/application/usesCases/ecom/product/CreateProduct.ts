import type { IProductRepository } from '../../../../domain/repositories/ecom/product/IProductRepository';
import type { Product } from '../../../../domain/entities/ecom/product/Product';

export class CreateProduct {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(productData: Product): Promise<void> {
    if (!productData.name.trim()) throw new Error('Nome do produto é obrigatório');
    if (productData.price <= 0) throw new Error('Preço deve ser maior que zero');
    
    await this.productRepository.create(productData);
  }
}
