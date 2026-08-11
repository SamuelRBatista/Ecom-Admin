import { useState, useEffect, useCallback } from 'react';

import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';

import { SupplierService } from '../../../../infrastructure/services/ecom/supplier/SupplierService';

import { GetAllSuppliers } from '../../../../application/usesCases/ecom/supplier/GetAllSupplier';
import { GetSupplierById } from '../../../../application/usesCases/ecom/supplier/GetSupplierById';
import { CreateSupplier } from '../../../../application/usesCases/ecom/supplier/CreateSupplier';
import { UpdateSupplier } from '../../../../application/usesCases/ecom/supplier/UpdateSupplier';
import { DeleteSupplier } from '../../../../application/usesCases/ecom/supplier/DeleteSupplier';

const service = new SupplierService();

export function useSupplier() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);

    try {
      const useCase = new GetAllSuppliers(service);

      const data = await useCase.execute();

      setSuppliers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? 'Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const createSupplier = async (supplier: Supplier) => {
    setLoading(true);

    try {
      const useCase = new CreateSupplier(service);

      const createdSupplier = await useCase.execute(supplier);

      await loadSuppliers();

      return createdSupplier;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (supplier: Supplier) => {
    setLoading(true);

    try {
      const useCase = new UpdateSupplier(service);

      await useCase.execute(supplier);

      await loadSuppliers();
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: number) => {
    setLoading(true);

    try {
      const useCase = new DeleteSupplier(service);

      await useCase.execute(id);

      await loadSuppliers();
    } finally {
      setLoading(false);
    }
  };

  const getSupplierById = async (id: number) => {
    const useCase = new GetSupplierById(service);

    return await useCase.execute(id);
  };

  return {
    suppliers,

    loading,

    error,

    loadSuppliers,

    createSupplier,

    updateSupplier,

    deleteSupplier,

    getSupplierById,
  };
}