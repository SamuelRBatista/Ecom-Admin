import { useState, useEffect } from 'react';
import { SupplierService } from '../../../../infrastructure/services/ecom/supplier/SupplierService';
import { GetAllSuppliers } from '../../../../application/usesCases/ecom/supplier/GetAllSupplier';
import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const useCase = new GetAllSuppliers(new SupplierService());
    useCase.execute()
      .then(setSuppliers)
      .catch(() => setError(true))
      .finally(() => setLoading(false));      
      }, []);
  return { suppliers, loading, error };
}
