// infrastructure/services/ecom/product/ProductService.ts
import axios from 'axios';
import type { Product } from '../../../../domain/entities/ecom/product/Product';
import type { IProductRepository } from '../../../../domain/repositories/ecom/product/IProductRepository';

// Configuração centralizada
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5124/api';
const STATIC_FILES_BASE_URL = import.meta.env.VITE_STATIC_FILES_URL || 'https://localhost:7252';

export class ProductService implements IProductRepository {
  private baseUrl = `${API_BASE_URL}/Products`;

  async getAll(): Promise<Product[]> {
    const res = await axios.get(this.baseUrl);
    return res.data;
  }

  async getById(id: number): Promise<Product> {
    const res = await axios.get(`${this.baseUrl}/${id}`);
    return res.data;
  }

  async create(formData: FormData): Promise<Product> {
    const response = await axios.post<Product>(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async update(formData: FormData): Promise<void> {
    const id = formData.get('id');
    if (!id) throw new Error('Id do produto não fornecido no FormData');

    await axios.put(`${this.baseUrl}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async sell(id: number, quantity: number): Promise<void> {
    await axios.post(`${this.baseUrl}/${id}/sell`, { quantity });
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  // Método auxiliar para construir URL da imagem
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${STATIC_FILES_BASE_URL}/${cleanPath}`;
  }
}