# ⚡ Próximas Ações Imediatas

## 🔧 Instalar Dependências (Se Não Estiverem)

```bash
npm install lucide-react
# lucide-react para ícones melhores (opcional, já temos FontAwesome)
```

## ✅ Tarefas Prontas para Hoje

### 1️⃣ Refatorar ClientFormPage (30 min)
Copie o arquivo de exemplo:
```bash
# Abra: EXEMPLO_ClientFormPage_Refatorado.tsx
# Copie para: src/presentation/pages/ecom/client/ClientFormPage.tsx
```

### 2️⃣ Refatorar ClientPage (30 min)
Use o mesmo padrão do ProductPage:
- Remover estilos inline
- Usar DataTable
- Adicionar ToastContainer
- Usar novos botões

### 3️⃣ Testar Todo Fluxo (15 min)
- [ ] Criar novo cliente
- [ ] Editar cliente
- [ ] Deletar cliente
- [ ] Ver notificações

## 🎯 Tarefas para Essa Semana

- [ ] **Segunda:** Refatorar todas as páginas de Cliente
- [ ] **Terça:** Refatorar todas as páginas de Fornecedor
- [ ] **Quarta:** Remover arquivos styles.ts antigos
- [ ] **Quinta:** Adicionar testes
- [ ] **Sexta:** Deploy em produção

## 🔄 Como Refatorar uma Página Rapidamente

### 1. Copie este template

```typescript
import { useState } from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { DataTable, PrimaryButton, ConfirmModal, ToastContainer } from '@/presentation/components/shared';
import { useToast } from '@/shared/hooks/useToast';
import { ErrorHandler } from '@/shared/helpers/ErrorHandler';
import { colors } from '@/presentation/themes/theme';

export default function MyPage() {
  const { toasts, removeToast, success, error: showError } = useToast();
  // resto do código
}
```

### 2. Substitua elementos individuais

**Antes:**
```typescript
<div style={styles.content}>
  <h2 style={styles.title}>Minha Lista</h2>
  <button style={styles.btnNew}>Novo</button>
</div>
```

**Depois:**
```typescript
<Paper sx={{ borderRadius: '12px' }}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3, backgroundColor: colors.background }}>
    <Typography variant="h2">Minha Lista</Typography>
    <PrimaryButton>Novo</PrimaryButton>
  </Box>
</Paper>
```

### 3. Validação de formulário

**Antes:**
```typescript
const [formData, setFormData] = useState({});
const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
```

**Depois:**
```typescript
const { formData, getFieldError, handleInputChange, handleSubmit } = useFormHandler({
  initialValues: { ... },
  validationSchema: mySchema,
});

<FormInput
  name="email"
  error={!!getFieldError('email')}
  helperText={getFieldError('email')}
  {...rest}
/>
```

## 💡 Dicas de Produtividade

### Atalho VSCode: Snippets

Crie um snippet para FormPage rapidamente:

```json
{
  "FormPage Template": {
    "prefix": "formpage",
    "body": [
      "<FormPage",
      "  title=\"${1:Título}\"",
      "  onSubmit={handleSubmit}",
      "  error={submitError}",
      ">",
      "  ${2:// Conteúdo}",
      "</FormPage>"
    ]
  }
}
```

### Busca e Substituição em Massa

**Remover todos os `styles.X` inline:**
1. Abra Search (Ctrl+H)
2. Buscar: `style={styles\.(\w+)}`
3. Substituir com: `sx={{ /* TODO: implementar */ }}`
4. Usar MUI sx prop ou className

## 🧪 Testar Sua Refatoração

```bash
# 1. Antes de commitar, teste
npm run dev

# 2. Abra o navegador e teste:
# - Carregar página
# - Criar novo registro
# - Editar registro
# - Deletar registro
# - Verificar notificações

# 3. Verificar console
# - Não deve ter erros
# - Não deve ter warnings desnecessários
```

## 📝 Commit Messages Recomendadas

```bash
# Padrão Conventional Commits
git commit -m "refactor(pages): refactor ClientFormPage to clean architecture"
git commit -m "feat(components): add new FormPage component"
git commit -m "style(theme): centralize colors and typography"
```

## 🆘 Erros Comuns e Soluções

### ❌ "Cannot find module '@/presentation/components/shared'"

**Solução:**
```typescript
// Verifique o import correto
import { PrimaryButton } from '@/presentation/components/shared';
// Se ainda não funcionar, use o caminho relativo
import { PrimaryButton } from '../../../components/shared';
```

### ❌ "Property 'toasts' does not exist on type 'UseToastReturn'"

**Solução:**
```typescript
// Correto
const { toasts, removeToast, success, error } = useToast();

// Errado
const { toast, remove, showSuccess } = useToast();
```

### ❌ "Validation not triggering"

**Solução:**
```typescript
// Certifique-se de chamar corretamente
<form onSubmit={handleSubmit(async (data) => {
  // sua lógica
})}>

// Não faça assim
<form onSubmit={handleSubmit}>
```

## 📊 Progress Tracking

Mantenha um checklist das páginas refatoradas:

```
Páginas de Produto:
  [x] ProductPage
  [x] ProductFormPage
  [ ] ProductEditPage
  [ ] ProductDetailsPage

Páginas de Cliente:
  [ ] ClientPage
  [ ] ClientFormPage
  [ ] ClientEditPage
  [ ] ClientDetailsPage

Páginas de Fornecedor:
  [ ] SupplierPage
  [ ] SupplierFormPage
  [ ] SupplierEditPage
  [ ] SupplierDetailsPage
```

## 🎓 Recursos de Aprendizado

Se tiver dúvidas sobre:

- **MUI:** https://mui.com/material-ui/
- **Yup:** https://github.com/jquense/yup
- **React Hooks:** https://react.dev/reference/react
- **Clean Architecture:** https://blog.cleancoder.com/

## 🚀 Deploy Checklist

Antes de fazer deploy em produção:

- [ ] Todos os testes passando
- [ ] Sem console.log em produção
- [ ] Sem window.location.reload()
- [ ] Validação funcionando
- [ ] Notificações funcionando
- [ ] Responsivo testado
- [ ] Performance testada
- [ ] Build otimizado: `npm run build`

## ✨ Resumo do Que Você Ganhou

```
📦 Componentes Reutilizáveis
   6 componentes prontos para usar

🎨 Tema Centralizado
   Cores, tipografia, componentes MUI customizados

✅ Validação Robusta
   Schemas Yup prontos e integrados

🛠️ Helpers Úteis
   ErrorHandler e FormatHelper

🪝 Hooks Customizados
   useFormHandler, useToast, useRefetch

📚 Documentação Completa
   Guias, exemplos e checklist

⏭️ Próximas Atualizações
   Todas as funcionalidades preparadas para refatoração
```

---

**🎯 Objetivo Final:** 
Toda a aplicação seguindo Clean Architecture com UI/UX consistente, validação robusta e código mantível.

**📈 Progresso:** 33% concluído
**⏱️ Tempo estimado restante:** 2-3 horas de refatoração

Você está no caminho certo! 🚀

