# 📚 Guia de Uso - Nova Arquitetura Clean

## 🎨 Temas e Cores

```typescript
import { theme, colors } from './presentation/themes/theme';
import { ThemeProvider } from '@mui/material/styles';

// Já implementado em App.tsx
// Cores disponíveis:
const { primary, secondary, success, error, warning, info } = colors;
```

## 🧩 Componentes Reutilizáveis

### 1️⃣ Botões

```typescript
import { 
  PrimaryButton, 
  SuccessButton, 
  DangerButton, 
  SecondaryButton 
} from '@/presentation/components/shared';

// Uso
<PrimaryButton onClick={handleSave} loading={isLoading}>
  Salvar
</PrimaryButton>

<DangerButton onClick={handleDelete}>
  Deletar
</DangerButton>
```

### 2️⃣ FormInput (Input de Formulário)

```typescript
import { FormInput } from '@/presentation/components/shared';

<FormInput
  label="Nome"
  name="name"
  value={formData.name}
  onChange={handleInputChange}
  onBlur={handleBlur}
  error={!!getFieldError('name')}
  helperText={getFieldError('name')}
  placeholder="Digite o nome"
/>
```

### 3️⃣ DataTable (Tabela Customizada)

```typescript
import { DataTable } from '@/presentation/components/shared';

<DataTable
  columns={columns}
  rows={data}
  loading={isLoading}
  error={error}
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
/>
```

### 4️⃣ ConfirmModal (Modal de Confirmação)

```typescript
import { ConfirmModal } from '@/presentation/components/shared';

<ConfirmModal
  open={isOpen}
  title="Confirmar Exclusão"
  message="Tem certeza?"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  loading={isDeleting}
  isDangerous={true}
/>
```

### 5️⃣ FormPage (Layout Padrão para Formulários)

```typescript
import { FormPage } from '@/presentation/components/shared';

<FormPage
  title="Criar Novo Produto"
  description="Preencha os dados"
  onSubmit={handleSubmit}
  error={submitError}
>
  {/* Seus campos aqui */}
</FormPage>
```

### 6️⃣ ToastContainer (Notificações)

```typescript
import { ToastContainer } from '@/presentation/components/shared';
import { useToast } from '@/shared/hooks/useToast';

// Em seu componente
const { toasts, removeToast, success, error } = useToast();

// Usar
success('Salvo com sucesso!');
error('Erro ao salvar');

// Renderizar
<ToastContainer toasts={toasts} onRemove={removeToast} />
```

## 🔐 Validação com Yup

### Usar Schemas Pré-prontos

```typescript
import { productValidationSchema } from '@/shared/validators';
import { useFormHandler } from '@/shared/hooks/useFormHandler';

const {
  formData,
  errors,
  getFieldError,
  handleInputChange,
  handleSubmit,
} = useFormHandler({
  initialValues: { name: '', price: 0 },
  validationSchema: productValidationSchema,
});
```

### Criar Novo Schema

```typescript
import * as yup from 'yup';

const mySchema = yup.object().shape({
  email: yup.string().required('Email é obrigatório').email('Email inválido'),
  age: yup.number().positive('Idade deve ser positiva'),
});
```

## 🛠️ Helpers

### ErrorHandler

```typescript
import { ErrorHandler } from '@/shared/helpers/ErrorHandler';

try {
  // seu código
} catch (err) {
  const msg = ErrorHandler.formatErrorMessage(err);
  console.log(msg); // Mensagem formatada
}
```

### FormatHelper

```typescript
import { FormatHelper } from '@/shared/helpers/FormatHelper';

FormatHelper.formatCurrency(150); // R$ 150,00
FormatHelper.formatPhone('11999999999'); // (11) 99999-9999
FormatHelper.formatCPF('12345678901'); // 123.456.789-01
FormatHelper.formatCEP('12345678'); // 12345-678
FormatHelper.truncate('texto longo', 10); // texto lo...
```

## 🎯 Padrão de Página Refatorada

```typescript
import { useState, useCallback } from 'react';
import { 
  FormPage,
  PrimaryButton,
  SecondaryButton,
  FormInput,
  ToastContainer,
} from '@/presentation/components/shared';
import { useFormHandler } from '@/shared/hooks/useFormHandler';
import { useToast } from '@/shared/hooks/useToast';
import { myValidationSchema } from '@/shared/validators';
import { ErrorHandler } from '@/shared/helpers/ErrorHandler';

export default function MyPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toasts, removeToast, success, error } = useToast();
  
  const { formData, errors, getFieldError, handleInputChange, handleSubmit } = 
    useFormHandler({
      initialValues: { name: '', email: '' },
      validationSchema: myValidationSchema,
    });

  const onSubmit = useCallback(async (data: any) => {
    try {
      // sua lógica
      success('Salvo!');
    } catch (err) {
      const msg = ErrorHandler.formatErrorMessage(err);
      setSubmitError(msg);
      error(msg);
    }
  }, []);

  return (
    <>
      <FormPage
        title="Meu Formulário"
        onSubmit={handleSubmit(onSubmit)}
        error={submitError}
      >
        <FormInput
          label="Nome"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={!!getFieldError('name')}
          helperText={getFieldError('name')}
        />
        
        <Stack direction="row" spacing={2}>
          <SecondaryButton>Cancelar</SecondaryButton>
          <PrimaryButton type="submit">Salvar</PrimaryButton>
        </Stack>
      </FormPage>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
```

## ✅ Checklist para Refatoração

- [ ] Importar novos componentes
- [ ] Remover estilos inline (style={...})
- [ ] Usar FormInput em vez de TextField
- [ ] Usar useFormHandler para validação
- [ ] Remover console.log e window.location.reload()
- [ ] Adicionar ToastContainer para notificações
- [ ] Usar ErrorHandler para mensagens de erro
- [ ] Testar em diferentes tamanhos de tela

## 📞 Suporte

Se encontrar problemas:
1. Verifique os tipos TypeScript
2. Certifique-se das importações corretas
3. Valide os schemas Yup
4. Verifique o console do navegador

