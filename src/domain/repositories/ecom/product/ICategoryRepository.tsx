import type { Category } from '../../../entities/ecom/product/Category';

export interface ICategoryRepository {
  getAll(): Promise<Category[]>; 
}
