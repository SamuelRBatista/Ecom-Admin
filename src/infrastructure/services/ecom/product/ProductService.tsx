import axios from 'axios';
import type { Product } from '../../../../domain/entities/ecom/product/Product';
import type { IProductRepository } from '../../../../domain/repositories/ecom/product/IProductRepository';

export class ProductService implements IProductRepository {
  private baseUrl = 'http://localhost:5124/api/Products'; // ajuste conforme necessário

  async getAll(): Promise<Product[]> {
    const res = await axios.get(this.baseUrl);
    return res.data;
  }

  async getById(id: number): Promise<Product> { 
    const res = await axios.get(`${this.baseUrl}/${id}`);
    return res.data;
  }

  async create(product: Product): Promise<void> {    
  await axios.post(this.baseUrl, product, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

  async update(product: Product): Promise<void> {
    await axios.put(`${this.baseUrl}/${product.id}`, product);
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
