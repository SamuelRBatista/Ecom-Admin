import { useState, useEffect } from 'react';
import type { Category } from '../../../../domain/entities/ecom/product/Category';
import { CategoryService } from '../../../../infrastructure/services/ecom/product/CategoryService';

export default function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const service = new CategoryService();
        const data = await service.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

  return { categories };
}
