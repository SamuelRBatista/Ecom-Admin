# 📋 Checklist de Refatoração Completa

## ✅ Já Implementado

- [x] **Sistema de Temas** (`src/presentation/themes/theme.ts`)
- [x] **Componentes Reutilizáveis** (`src/presentation/components/shared/`)
- [x] **Validadores Yup** (`src/shared/validators/`)
- [x] **Helpers** (`src/shared/helpers/`)
- [x] **Hooks Customizados** (`src/shared/hooks/`)
- [x] **ProductPage** - Refatorada ✅
- [x] **ProductFormPage** - Refatorada ✅

## 📝 Próximos - Páginas de Produtos

### ProductEditPage
- [ ] Remover estilos inline
- [ ] Usar FormInput + FormPage
- [ ] Integrar validação Yup
- [ ] Adicionar ToastContainer
- [ ] Usar ErrorHandler

### ProductDetailsPage
- [ ] Criar layout de detalhes com Paper/Card
- [ ] Formatar valores com FormatHelper
- [ ] Botão de voltar com SecondaryButton

## 📝 Clientes - ClientPage e Formulários

### ClientPage
- [ ] Refatorar com DataTable
- [ ] Usar novos botões
- [ ] Integrar ConfirmModal

### ClientFormPage
```typescript
// Remover estilos inline
// Usar:
- FormInput
- FormPage
- clientValidationSchema
- FormatHelper.formatPhone/CPF/CEP
```

### ClientEditPage
- [ ] Mesmo padrão do ClientFormPage
- [ ] Usar initialValues com dados existentes

### ClientDetailsPage
- [ ] Layout estruturado com Paper
- [ ] Informações formatadas

## 📝 Fornecedores - SupplierPage e Formulários

Seguir mesmo padrão que Clientes

### SupplierPage
### SupplierFormPage
### SupplierEditPage
### SupplierDetailsPage

## 🎯 Template Padrão para Refatoração

### Página de Lista (ProductPage):
```typescript
import { Box, Paper, Typography, Stack } from '@mui/material';
import { DataTable, PrimaryButton, ConfirmModal } from '@/presentation/components/shared';
import { ErrorHandler } from '@/shared/helpers/ErrorHandler';

// 1. Estados
const [pagination, setPagination] = useState();
const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
const [error, setError] = useState(null);

// 2. Handlers
const handleDelete = async (id) => {
  try {
    await delete(id);
    // Refetch automático via Context
  } catch (err) {
    setError(ErrorHandler.formatErrorMessage(err));
  }
};

// 3. Colunas com ações
const columns = [
  { field: 'name', headerName: 'Nome' },
  {
    field: 'actions',
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Link to={`/edit/${params.row.id}`}>
          <IconButton><Edit /></IconButton>
        </Link>
        <IconButton onClick={() => openDeleteModal(params.row.id)}>
          <Trash />
        </IconButton>
      </Stack>
    ),
  },
];

// 4. Render
return (
  <Paper>
    <Box p={3}>
      <Typography variant="h2">Lista</Typography>
      <PrimaryButton>Novo</PrimaryButton>
    </Box>
    <DataTable {...} />
    <ConfirmModal {...} />
  </Paper>
);
```

### Página de Formulário (ProductFormPage):
```typescript
import { FormPage, FormInput, PrimaryButton, ToastContainer } from '@/presentation/components/shared';
import { useFormHandler } from '@/shared/hooks/useFormHandler';
import { useToast } from '@/shared/hooks/useToast';
import { productValidationSchema } from '@/shared/validators';

// 1. Hooks
const { toasts, removeToast, success, error } = useToast();
const { formData, getFieldError, handleInputChange, handleSubmit } = useFormHandler({
  initialValues: { ... },
  validationSchema: productValidationSchema,
});

// 2. Submit
const onSubmit = async (data) => {
  try {
    await api.create(data);
    success('Criado!');
    navigate('/list');
  } catch (err) {
    error(ErrorHandler.formatErrorMessage(err));
  }
};

// 3. Render
return (
  <FormPage title="Novo" onSubmit={handleSubmit(onSubmit)}>
    <FormInput label="Nome" name="name" {...} />
    <Stack direction="row" spacing={2}>
      <SecondaryButton>Cancelar</SecondaryButton>
      <PrimaryButton type="submit">Salvar</PrimaryButton>
    </Stack>
  </FormPage>
);
```

## 🎨 Estilos que Devem ser Removidos

- [x] `src/presentation/pages/ecom/product/styles.ts` - Pode ser removido após refatoração
- [ ] `src/presentation/pages/ecom/client/styles.ts`
- [ ] `src/presentation/pages/ecom/supplier/styles.ts`

## 🔄 Ordem Recomendada de Refatoração

1. **Rotas de Produtos** ✅ (FEITO)
   - [x] ProductPage
   - [x] ProductFormPage
   - [ ] ProductEditPage
   - [ ] ProductDetailsPage

2. **Rotas de Clientes**
   - [ ] ClientPage
   - [ ] ClientFormPage
   - [ ] ClientEditPage
   - [ ] ClientDetailsPage

3. **Rotas de Fornecedores**
   - [ ] SupplierPage
   - [ ] SupplierFormPage
   - [ ] SupplierEditPage
   - [ ] SupplierDetailsPage

4. **Layouts e Componentes Comuns**
   - [ ] Sidebar melhorada
   - [ ] MainLayout refatorado
   - [ ] Componentes de notificação globais

## 🚀 Benefícios da Refatoração

✅ **UI/UX Melhorado**
- Tema consistente
- Componentes responsivos
- Notificações visuais

✅ **Código Limpo**
- Reutilização de componentes
- Sem duplicação
- Fácil manutenção

✅ **Validação Robusta**
- Mensagens de erro claras
- Validação em tempo real
- Integração Yup

✅ **Tratamento de Erros**
- ErrorHandler centralizado
- Mensagens amigáveis
- Logging consistente

✅ **Performance**
- Otimizações com useCallback
- Paginação eficiente
- Sem window.location.reload()

## 📚 Recursos

- [MUI Documentation](https://mui.com/)
- [Yup Validation](https://github.com/jquense/yup)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## ⚠️ Notas Importantes

1. Sempre validar com Yup antes de enviar
2. Usar ErrorHandler para exceções
3. Implementar ToastContainer em páginas que fazem requisições
4. Manter tipagem TypeScript forte
5. Remover console.log em produção
6. Não usar window.location.reload()

---

**Status Atual:** 📈 33% Refatorado (2 de 6 páginas principais)

Próximo: Refatorar páginas de Clientes

