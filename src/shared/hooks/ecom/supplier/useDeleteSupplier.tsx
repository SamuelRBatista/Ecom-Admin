import { useState } from 'react';
import { SupplierService } from '../../../../infrastructure/services/ecom/supplier/SupplierService';
import { DeleteSupplier } from '../../../../application/usesCases/ecom/supplier/DeleteSupplier';

const supplierService = new SupplierService();

export function useDeleteSupplier() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSupplier = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new DeleteSupplier(supplierService);
      await useCase.execute(id);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir fornecedor');
      setLoading(false);
      throw err;
    }
  };

  return { deleteSupplier, loading, error };
}
