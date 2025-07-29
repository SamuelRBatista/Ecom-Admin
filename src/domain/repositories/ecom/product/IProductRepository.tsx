import type { Product } from '../../../entities/ecom/product/Product';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product>;
  create(formData: FormData): Promise<Product>; 
  update(formData: FormData): Promise<void>;
  delete(id: number): Promise<void>;
}
