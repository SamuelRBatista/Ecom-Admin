import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TextField, MenuItem, Select, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { Product } from '../../../../domain/entities/ecom/product/Product';
import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import useCategory from '../../../../shared/hooks/ecom/product/useCategory';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import styles from './styles';

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { categories } = useCategory();
  const { product } = useAppContext(); // <-- usando contexto
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  // Carrega produto pelo contexto
  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const p = await product.getProductById(parseInt(id)); // <-- via contexto
          if (p) setFormData(p);
        } catch (error) {
          console.error('Erro ao buscar produto:', error);
        }
      };
      loadProduct();
    }
  }, [id, product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const form = new FormData();
      form.append('id', formData.id.toString());
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price.toString());
      form.append('sku', formData.sku);
      form.append('barCode', formData.barCode);
      form.append('categoryId', formData.categoryId.toString());

      if (imageFile) {
        form.append('Image', imageFile);
      }

      if (formData.imageUrl) {
        form.append('ExistingImageUrl', formData.imageUrl);
      }

      // Atualiza via contexto
      await product.updateProduct(form);

      navigate('/panel/product');
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
            {formData.imageUrl && (
              <div style={{ marginBottom: 10 }}>
                <p>Imagem atual:</p>
                <img
                  src={formData.imageUrl}
                  alt="Imagem atual"
                  style={{ width: '150px', borderRadius: 4 }}
                />
              </div>
            )}
            <InputLabel>Imagem:</InputLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                }
              }}
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
            <button type="submit" style={styles.btnSubmit}>
              Atualizar
            </button>
            <button
              type="button"
              onClick={() => navigate('/panel/product')}
              style={styles.btnCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}
