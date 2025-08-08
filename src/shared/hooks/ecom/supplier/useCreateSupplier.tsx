import { useState } from 'react';
import { SupplierService } from '../../../../infrastructure/services/ecom/supplier/SupplierService';
import { CreateSupplier } from '../../../../application/usesCases/ecom/supplier/CreateSupplier';
import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';

export function useCreateSupplier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (supplier: Supplier): Promise<Supplier | null> => {
    setLoading(true);
    setError(null);
    try {
      const service = new SupplierService();
      const createSupplier = new CreateSupplier(service);
      const createdSupplier = await createSupplier.execute(supplier);
      return createdSupplier;
    } catch (e) {
      setError('Erro ao criar fornecedor');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
