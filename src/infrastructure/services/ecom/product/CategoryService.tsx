import axios from 'axios';
import type { Category } from '../../../../domain/entities/ecom/product/Category';
import type { ICategoryRepository } from '../../../../domain/repositories/ecom/product/ICategoryRepository';

export class CategoryService implements ICategoryRepository {
  private baseUrl = 'http://localhost:5124/api/category'; // ajuste conforme necessário

  async getAll(): Promise<Category[]> {
    const res = await axios.get(this.baseUrl);
    return res.data;
  }
}