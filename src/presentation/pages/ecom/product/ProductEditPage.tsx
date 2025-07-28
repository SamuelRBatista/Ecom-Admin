import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {TextField, MenuItem, Select, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { Product } from '../../../../domain/entities/ecom/product/Product';
import { ProductService } from '../../../../infrastructure/services/ecom/product/ProductService';

import useCategory from '../../../../shared/hooks/ecom/product/useCategory';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import styles from './styles';

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategory();
  const productService = new ProductService();

  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    sku: '',
    barCode: '',
    imageUrl: '',
    categoryId: 0,
  });

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const product = await productService.getById(parseInt(id));
          setFormData(product);
        } catch (error) {
          console.error('Erro ao buscar produto:', error);
        }
      };
      loadProduct();
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.update(formData);
      navigate('/');
    } catch (err) {
      console.error('Erro ao atualizar produto', err);
    }
  };

  return (
    <SidebarLayout isCollapsed={false}>
      <div style={styles.cadastroFormContainer}>
        <h2 style={styles.title}>Editar Produto</h2>
        <form onSubmit={handleSubmit} style={styles.cadastroForm}>
          <div style={styles.formGroup}>
            <TextField
              id="name"
              type="text"
              name="name"
              label="Nome"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Digite o nome do produto"
              style={styles.formControl}
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.halfWidth}>
              <TextField
                id="description"
                label="Descrição:"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                style={styles.formControl}
              />
            </div>

            <div style={styles.halfWidth}>
              <TextField
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="R$0,00"
                label="Preço:"
                style={styles.formControl}
              />
            </div>

            <div style={styles.halfWidth}>
              <TextField
                id="sku"
                label="Sku:"
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
                placeholder="0"
                style={styles.formControl}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.halfWidth}>
              <TextField
                id="barcode"
                label="Código de barras:"
                type="text"
                name="barCode"
                value={formData.barCode}
                onChange={handleInputChange}
                style={styles.formControl}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <TextField
              id="imageUrl"
              label="Imagem:"
              name="imageUrl"
              multiline
              maxRows={20}
              value={formData.imageUrl}
              onChange={handleInputChange}
              style={styles.formControl}
            />
          </div>

          <div style={styles.halfWidth}>
            <InputLabel id="application-status-label">Categoria</InputLabel>
            <Select
              labelId="application-status-label"
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleSelectChange}
              label="Categoria"
              style={styles.formControl}
            >
              <MenuItem value="">Selecione a categoria</MenuItem>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Nenhuma categoria encontrada</MenuItem>
              )}
            </Select>
          </div>

          <div style={styles.formActions}>
            <button type="submit" style={styles.btnSubmit}>Atualizar</button>
            <button type="button" onClick={() => navigate('/panel/product')} style={styles.btnCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}
