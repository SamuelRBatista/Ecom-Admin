import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import { useProduct } from '../hooks/ecom/product/useProducts';
import { useClient } from '../hooks/ecom/client/useClients';
import { useSupplier } from '../hooks/ecom/supplier/useSuppliers';

type AppContextType = {
  product: ReturnType<typeof useProduct>;
  client: ReturnType<typeof useClient>;
  supplier: ReturnType<typeof useSupplier>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

type ContextProviderProps = {
  children: ReactNode;
};

export function ContextProvider({ children }: ContextProviderProps) {

  const product = useProduct();
  const client = useClient();
  const supplier = useSupplier();

  return (
    <AppContext.Provider
      value={{
        product,
        client,
        supplier,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useAppContext deve ser usado dentro de um ContextProvider'
    );
  }

  return context;
}