import type { Product } from '../../../entities/ecom/product/Product';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(id: number): Promise<void>;
}
