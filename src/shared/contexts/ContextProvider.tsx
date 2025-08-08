import { createContext, useContext } from 'react';

import { useProducts } from '../hooks/ecom/product/useProducts';
import { useCreateProduct } from '../hooks/ecom/product/useCreateProduct';
import { useUpdateProduct } from '../hooks/ecom/product/useUpdateProduct';
import { useDeleteProduct } from '../hooks/ecom/product/useDeleteProduct';
import { useProductById } from '../hooks/ecom/product/useProductById';
import type { Product } from '../../domain/entities/ecom/product/Product';

import { useClients } from '../hooks/ecom/client/useClients';
import { useCreateClient } from '../hooks/ecom/client/useCreateClient';
import { useUpdateClient } from '../hooks/ecom/client/useUpdateClient';
import { useDeleteClient } from '../hooks/ecom/client/useDeleteClient';
import { useClientById } from '../hooks/ecom/client/useClientById';
import type { Client } from '../../domain/entities/ecom/client/Client';

import { useSuppliers } from '../hooks/ecom/supplier/useSuppliers';
import { useCreateSupplier } from '../hooks/ecom/supplier/useCreateSupplier';
import { useUpdateSupplier } from '../hooks/ecom/supplier/useUpdateSupplier';
import { useDeleteSupplier } from '../hooks/ecom/supplier/useDeleteSupplier';
import { useSupplierById } from '../hooks/ecom/supplier/useSupplierById';
import type { Supplier } from '../../domain/entities/ecom/supplier/Supplier';
// (se tiver createClient, updateClient, deleteClient, importe aqui também)

type AppContextType = {
  product: {
    products: Product[];
    loading: boolean;
    error: boolean;
    createProduct: (formData: FormData) => Promise<Product | null>;
    updateProduct: (formData: FormData) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getProductById: (id: number) => Promise<Product | null>;
  };
   client: {
    clients: Client[];
    loading: boolean;
    error: boolean;
    createClient: (client: Client) => Promise<Client | null>;   // <-- aqui
    updateClient: (client: Client) => Promise<void>;            // <-- aqui
    deleteClient: (id: number) => Promise<void>;
    getClientById: (id: number) => Promise<Client | null>;
  };
    supplier: {
    suppliers: Supplier[];
    loading: boolean;
    error: boolean;
    createSupplier: (supplier: Supplier) => Promise<Supplier | null>;   // <-- aqui
    updateSupplier: (supplier: Supplier) => Promise<void>;            // <-- aqui
    deleteSupplier: (id: number) => Promise<void>;
    getSupplierById: (id: number) => Promise<Supplier | null>;
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  // Produtos
  const { products, loading: loadingProducts, error: errorProducts } = useProducts();
  const { create, loading: loadingCreate } = useCreateProduct();
  const { updateProduct, loading: loadingUpdate } = useUpdateProduct();
  const { deleteProduct, loading: loadingDelete } = useDeleteProduct();
  const { getProductById, loading: loadingGetProductById } = useProductById();

  // Clientes
  const { clients, loading: loadingClients, error: errorClients } = useClients();
  const { create: createClient, loading: loadingCreateClient } = useCreateClient();
  const { updateClient, loading: loadingUpdateClient } = useUpdateClient();
  const { deleteClient, loading: loadingDeleteClient } = useDeleteClient();
  const { getClientById, loading: loadingGetClientById } = useClientById();

  // Suppliers
  const { suppliers, loading: loadingSuppliers, error: errorSuppliers } = useSuppliers();
  const { create: createSupplier, loading: loadingCreateSupplier } = useCreateSupplier();
  const { updateSupplier, loading: loadingUpdateSupplier } = useUpdateSupplier();
  const { deleteSupplier, loading: loadingDeleteSupplier } = useDeleteSupplier();
  const { getSupplierById, loading: loadingGetSupplierById } = useSupplierById();

  return (
    <AppContext.Provider
      value={{
        product: {
          products,
          loading: loadingProducts || loadingCreate || loadingUpdate || loadingDelete || loadingGetProductById,
          error: errorProducts,
          createProduct: create,
          updateProduct,
          deleteProduct,
          getProductById,
        },
          client: {
          clients,
          loading: loadingClients || loadingCreateClient || loadingUpdateClient || loadingDeleteClient || loadingGetClientById,
          error: errorClients,
          createClient,  
          updateClient,
          deleteClient,
          getClientById,
        },
          supplier: {
          suppliers,
          loading: loadingSuppliers || loadingCreateSupplier || loadingUpdateSupplier || loadingDeleteSupplier || loadingGetSupplierById,
          error: errorSuppliers,
          createSupplier,  
          updateSupplier,
          deleteSupplier,
          getSupplierById,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um ContextProvider');
  }
  return context;
}
