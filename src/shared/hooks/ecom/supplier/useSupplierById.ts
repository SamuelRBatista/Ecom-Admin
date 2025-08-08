import { useState } from 'react';
import { SupplierService } from '../../../../infrastructure/services/ecom/supplier/SupplierService';
import { GetSupplierById } from '../../../../application/usesCases/ecom/supplier/GetSupplierById';
import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';

export function useSupplierById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSupplierById = async (id: number): Promise<Supplier | null> => {
    setLoading(true);
    setError(null);
    try {
      const service = new SupplierService();
      const getSupplierByIdUseCase = new GetSupplierById(service);
      const supplier = await getSupplierByIdUseCase.execute(id);
      return supplier;
    } catch (e) {
      setError('Erro ao buscar forncedor');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getSupplierById, loading, error };
}
