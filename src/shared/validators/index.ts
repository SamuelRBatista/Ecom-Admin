import * as yup from 'yup';

export const productValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  price: yup
    .number()
    .required('Preço é obrigatório')
    .positive('Preço deve ser maior que 0'),
  sku: yup
    .string()
    .required('SKU é obrigatório')
    .min(3, 'SKU deve ter no mínimo 3 caracteres'),
  barCode: yup
    .string()
    .required('Código de barras é obrigatório'),
  categoryId: yup
    .number()
    .required('Categoria é obrigatória')
    .positive('Selecione uma categoria válida'),
});

export const clientValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX'),
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido'),
  phoneNumber: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX'),
  address: yup
    .string()
    .required('Endereço é obrigatório')
    .min(5, 'Endereço deve ter no mínimo 5 caracteres'),
  neighborhood: yup
    .string()
    .required('Bairro é obrigatório'),
  zipCode: yup
    .string()
    .required('CEP é obrigatório')
    .matches(/^\d{5}-\d{3}$/, 'CEP deve estar no formato XXXXX-XXX'),
  stateId: yup
    .number()
    .required('Estado é obrigatório')
    .positive('Selecione um estado válido'),
  cityId: yup
    .number()
    .required('Cidade é obrigatória')
    .positive('Selecione uma cidade válida'),
});

export const supplierValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido'),
  phoneNumber: yup
    .string()
    .required('Telefone é obrigatório')
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX'),
  address: yup
    .string()
    .required('Endereço é obrigatório')
    .min(5, 'Endereço deve ter no mínimo 5 caracteres'),
  neighborhood: yup
    .string()
    .required('Bairro é obrigatório'),
  zipCode: yup
    .string()
    .required('CEP é obrigatório')
    .matches(/^\d{5}-\d{3}$/, 'CEP deve estar no formato XXXXX-XXX'),
  stateId: yup
    .number()
    .required('Estado é obrigatório')
    .positive('Selecione um estado válido'),
  cityId: yup
    .number()
    .required('Cidade é obrigatória')
    .positive('Selecione uma cidade válida'),
});
