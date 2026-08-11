// pages/panel/product/ProductFormPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Stack,
  Chip,
  IconButton,
  Typography,
  TextField,
  
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { Product } from '../../../../domain/entities/ecom/product/Product';
import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import useCategory from '../../../../shared/hooks/ecom/product/useCategory';
import { useSupplier } from '../../../../shared/hooks/ecom/supplier/useSuppliers'; // ✅ Importação correta
import { useToast } from '../../../../shared/hooks/useToast';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import {
  FormPage,
  PrimaryButton,
  SecondaryButton,
  ToastContainer,
} from '../../../components/shared';
import { MoneyInput } from '../../../components/shared/MoneyInput';

type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'totalReviews' | 'totalSales' | 'viewsCount' | 'images' | 'attributes'>;

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { categories } = useCategory();
  const { suppliers } = useSupplier(); // ✅ Agora funciona
  const { product } = useAppContext();
  const { toasts, removeToast, error: showToastError, success: showToastSuccess } = useToast();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<{ key: string; value: string; group: string }[]>([]);
  const [newAttribute, setNewAttribute] = useState({ key: '', value: '', group: '' });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    costPrice: 0,
    sku: '',
    barCode: '',
    imageUrl: '',
    categoryId: 0,
    supplierId: 0,
    stockQuantity: 0,
    minimumStock: 0,
    unitOfMeasure: 'UN',
    weight: 0,
    height: 0,
    width: 0,
    depth: 0,
    brand: '',
    model: '',
    color: '',
    size: '',
    material: '',
    manufacturer: '',
    manufactureDate: '',
    expirationDate: '',
    isActive: true,
    isFeatured: false,
    isNew: true,
    isDigital: false,
    hasVariants: false,
    status: 'Draft',
    visibility: 'NotVisible',
    observations: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      let newValue: string | number = value;
      
      if (name === 'price' || name === 'costPrice' || name === 'stockQuantity' || 
          name === 'minimumStock' || name === 'weight' || name === 'height' || 
          name === 'width' || name === 'depth') {
        if (value === '') {
          newValue = 0;
        } else {
          const numValue = parseFloat(value);
          newValue = isNaN(numValue) ? 0 : numValue;
        }
      }
      
      return { ...prev, [name]: newValue };
    });
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ Corrigido: Tipo correto para SelectChangeEvent
  const handleSelectChange = (e: SelectChangeEvent<number | string>) => {
    const { name, value } = e.target;
    if (name) {
      const newValue = typeof value === 'string' ? value : Number(value);
      
      setFormData((prev) => ({ ...prev, [name]: newValue }));
      
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleBlur = () => {};

  const getFieldError = (field: string) => {
    return errors[field] || '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToastError('Arquivo de imagem muito grande (máximo 5MB)');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showToastError('Arquivo selecionado não é uma imagem válida');
        return;
      }
      setImageFile(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) => file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')
      );
      setAdditionalImages((prev) => [...prev, ...validFiles]);
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addAttribute = () => {
    if (newAttribute.key && newAttribute.value) {
      setAttributes([...attributes, { ...newAttribute }]);
      setNewAttribute({ key: '', value: '', group: '' });
    }
  };

  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU é obrigatório';
    }
    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Selecione uma categoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      showToastError('Por favor, corrija os campos destacados');
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();
      
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('shortDescription', formData.shortDescription || '');
      form.append('sku', formData.sku);
      form.append('barCode', formData.barCode || '');
      form.append('price', formData.price.toString());
      form.append('costPrice', formData.costPrice?.toString() || '0');
      form.append('categoryId', formData.categoryId.toString());
      form.append('supplierId', formData.supplierId?.toString() || '');
      form.append('stockQuantity', formData.stockQuantity?.toString() || '0');
      form.append('minimumStock', formData.minimumStock?.toString() || '');
      form.append('unitOfMeasure', formData.unitOfMeasure || 'UN');
      form.append('weight', formData.weight?.toString() || '');
      form.append('height', formData.height?.toString() || '');
      form.append('width', formData.width?.toString() || '');
      form.append('depth', formData.depth?.toString() || '');
      form.append('brand', formData.brand || '');
      form.append('model', formData.model || '');
      form.append('color', formData.color || '');
      form.append('size', formData.size || '');
      form.append('material', formData.material || '');
      form.append('manufacturer', formData.manufacturer || '');
      form.append('manufactureDate', formData.manufactureDate || '');
      form.append('expirationDate', formData.expirationDate || '');
      form.append('isDigital', String(formData.isDigital || false));
      form.append('isActive', String(formData.isActive));
      form.append('isFeatured', String(formData.isFeatured));
      form.append('isNew', String(formData.isNew));
      form.append('observations', formData.observations || '');

      if (imageFile) {
        form.append('Image', imageFile);
      }

      additionalImages.forEach((file) => {
        form.append('AdditionalImages', file);
      });

      attributes.forEach((attr) => {
        form.append('Attributes', JSON.stringify(attr));
      });

      await product.createProduct(form);
      showToastSuccess('Produto criado com sucesso!');
      setTimeout(() => {
        navigate('/panel/product');
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto';
      setSubmitError(errorMessage);
      showToastError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarLayout isCollapsed={false}>
      <FormPage
        title="Criar Novo Produto"
        description="Preencha os campos abaixo para adicionar um novo produto ao seu catálogo"
        onSubmit={handleSubmit}
        error={submitError}
        loading={isSubmitting}
      >
        {/* Informações Básicas */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Informações Básicas</Typography>
        
        <Stack spacing={2}>
          <TextField
            label="Nome do Produto"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={!!getFieldError('name')}
            helperText={getFieldError('name')}
            required
            fullWidth
          />

          <TextField
            label="Descrição Curta"
            name="shortDescription"
            value={formData.shortDescription || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            helperText="Breve descrição para listagens"
            fullWidth
          />

          <TextField
            label="Descrição Completa"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={handleBlur}
            multiline
            rows={4}
            error={!!getFieldError('description')}
            helperText={getFieldError('description')}
            required
            fullWidth
          />
        </Stack>

        {/* Preços */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Preços</Typography>
        
        {/* ✅ CORRIGIDO: Usar Box com flex em vez de Grid com item */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <MoneyInput
              label="Preço de Venda (R$)"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={!!getFieldError('price')}
              helperText={getFieldError('price')}
              required
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <MoneyInput
              label="Preço de Custo (R$)"
              name="costPrice"
              value={formData.costPrice || 0}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
          </Box>
        </Box>

        {/* Estoque */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Estoque</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Quantidade em Estoque"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity || 0}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Estoque Mínimo"
              name="minimumStock"
              type="number"
              value={formData.minimumStock || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
        </Box>

        <TextField
          label="Unidade de Medida"
          name="unitOfMeasure"
          value={formData.unitOfMeasure || 'UN'}
          onChange={handleInputChange}
          onBlur={handleBlur}
          helperText="Ex: UN, KG, L, M"
          fullWidth
        />

        {/* Identificação */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Identificação</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={!!getFieldError('sku')}
              helperText={getFieldError('sku')}
              required
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Código de Barras"
              name="barCode"
              value={formData.barCode || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
        </Box>

        {/* Dimensões */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Dimensões</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Peso (kg)"
              name="weight"
              type="number"
              value={formData.weight || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Altura (cm)"
              name="height"
              type="number"
              value={formData.height || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Largura (cm)"
              name="width"
              type="number"
              value={formData.width || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Profundidade (cm)"
              name="depth"
              type="number"
              value={formData.depth || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
        </Box>

        {/* Especificações */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Especificações</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Marca"
              name="brand"
              value={formData.brand || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Modelo"
              name="model"
              value={formData.model || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Cor"
              name="color"
              value={formData.color || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Tamanho"
              name="size"
              value={formData.size || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Material"
              name="material"
              value={formData.material || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Fabricante"
              name="manufacturer"
              value={formData.manufacturer || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Data de Fabricação"
              name="manufactureDate"
              type="date"
              value={formData.manufactureDate || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <TextField
              label="Data de Validade"
              name="expirationDate"
              type="date"
              value={formData.expirationDate || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Categoria e Fornecedor */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Categoria e Fornecedor</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth error={!!getFieldError('categoryId')}>
              <InputLabel>Categoria *</InputLabel>
              <Select
                label="Categoria *"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>Selecione uma categoria</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {getFieldError('categoryId') && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {getFieldError('categoryId')}
                </Typography>
              )}
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Fornecedor</InputLabel>
              <Select
                label="Fornecedor"
                name="supplierId"
                value={formData.supplierId || 0}
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>Selecione um fornecedor</MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Imagens */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Imagens</Typography>
        
        <Box>
          <Typography variant="subtitle2" fontWeight="500">Imagem Principal</Typography>
          <Paper
            sx={{
              p: 2,
              mt: 1,
              border: '2px dashed #ddd',
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': { borderColor: '#7e6560' },
            }}
            component="label"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Stack alignItems="center" spacing={1}>
              <span>📷 {imageFile ? imageFile.name : 'Clique para selecionar a imagem principal'}</span>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight="500">Imagens Adicionais</Typography>
          <Paper
            sx={{
              p: 2,
              mt: 1,
              border: '2px dashed #ddd',
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': { borderColor: '#7e6560' },
            }}
            component="label"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImagesChange}
              style={{ display: 'none' }}
            />
            <Stack alignItems="center" spacing={1}>
              <span>📷 Clique para selecionar imagens adicionais</span>
              {additionalImages.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                  {additionalImages.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeAdditionalImage(index)}
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          </Paper>
        </Box>

        {/* Atributos */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>Atributos Personalizados</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Chave"
              value={newAttribute.key}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewAttribute({ ...newAttribute, key: e.target.value })
              }
              placeholder="Ex: Processador"
              fullWidth
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Valor"
              value={newAttribute.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewAttribute({ ...newAttribute, value: e.target.value })
              }
              placeholder="Ex: Intel i7"
              fullWidth
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Grupo"
              value={newAttribute.group}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewAttribute({ ...newAttribute, group: e.target.value })
              }
              placeholder="Ex: Especificações"
              fullWidth
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={addAttribute} color="primary">
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {attributes.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {attributes.map((attr, index) => (
              <Chip
                key={index}
                label={`${attr.key}: ${attr.value}${attr.group ? ` (${attr.group})` : ''}`}
                onDelete={() => removeAttribute(index)}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        )}

        {/* Observações */}
        <TextField
          label="Observações"
          name="observations"
          value={formData.observations || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
          multiline
          rows={3}
          placeholder="Observações internas sobre o produto"
          fullWidth
        />

        {/* Botões */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <SecondaryButton onClick={() => navigate('/panel/product')}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={isSubmitting} loading={isSubmitting}>
            Criar Produto
          </PrimaryButton>
        </Stack>
      </FormPage>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </SidebarLayout>
  );
}