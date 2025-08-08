import { useState } from 'react';
import { SupplierService } from '../../../../infrastructure/services/ecom/supplier/SupplierService';
import { UpdateSupplier } from '../../../../application/usesCases/ecom/supplier/UpdateSupplier';
import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';

const supplierService = new SupplierService();

export function useUpdateSupplier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSupplier = async (supplier: Supplier): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new UpdateSupplier(supplierService);
      await useCase.execute(supplier);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar supplier');
      setLoading(false);
      throw err;
    }
  };

  return { updateSupplier, loading, error };
}
