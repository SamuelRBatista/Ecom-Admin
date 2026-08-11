import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import { PrimaryButton, SecondaryButton, ToastContainer } from '../../../components/shared';
import { useAppContext } from '../../../../shared/contexts/ContextProvider';
import useCategory from '../../../../shared/hooks/ecom/product/useCategory';
import { useToast } from '../../../../shared/hooks/useToast';

export default function SalePage() {
  const navigate = useNavigate();
  const { product } = useAppContext();
  const { categories } = useCategory();
  const { toasts, removeToast, success, error } = useToast();

  const [productId, setProductId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProduct = useMemo(
    () => product.products.find((item) => item.id === productId) ?? null,
    [product.products, productId]
  );

  const categoryName = selectedProduct
    ? categories.find((c) => c.id === selectedProduct.categoryId)?.name ?? 'Sem categoria'
    : 'Selecione um produto';

  const handleProductChange = (event: SelectChangeEvent<number | ''>) => {
    const value = event.target.value;
    setProductId(typeof value === 'number' ? value : Number(value));
  };

  const handleSubmit = async () => {
    if (!productId || quantity <= 0) {
      return;
    }

    if (selectedProduct && selectedProduct.stockQuantity < quantity) {
      return;
    }

    setIsSubmitting(true);
    try {
      await product.sellProduct(productId, quantity);
      success('Produto vendido com sucesso.');
      setQuantity(1);
      setProductId('');
    } catch (err: any) {
      error(err?.message ?? 'Erro ao registrar venda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarLayout isCollapsed={false}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography variant="h3">Vendas</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Registre vendas e atualize automaticamente o estoque.
                  </Typography>
                </div>
                <SecondaryButton onClick={() => navigate('/panel')} startIcon={<ArrowBackIcon />}>
                  Voltar
                </SecondaryButton>
              </Box>

              <Box component={Card} sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel id="product-select-label">Produto</InputLabel>
                    <Select
                      labelId="product-select-label"
                      value={productId}
                      label="Produto"
                      onChange={handleProductChange}
                    >
                      <MenuItem value="">Selecione</MenuItem>
                      {product.products.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name} - {item.sku}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Quantidade"
                    type="number"
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    inputProps={{ min: 1 }}
                    fullWidth
                  />

                  {selectedProduct && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Detalhes do produto selecionado
                      </Typography>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Typography>
                          <strong>Preço:</strong> {selectedProduct.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </Typography>
                        <Typography>
                          <strong>Estoque:</strong> {selectedProduct.stockQuantity}
                        </Typography>
                        <Typography>
                          <strong>Categoria:</strong> {categoryName}
                        </Typography>
                      </Stack>
                    </Box>
                  )}

                  <Divider />

                  <PrimaryButton onClick={handleSubmit} loading={isSubmitting}>
                    Registrar Venda
                  </PrimaryButton>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </SidebarLayout>
  );
}
