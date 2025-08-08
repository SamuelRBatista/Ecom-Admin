import { useState } from 'react';
import { DeleteClient } from '../../../../application/usesCases/ecom/client/DeleteClient';
import { ClientService } from '../../../../infrastructure/services/ecom/client/ClientService';

const clientService = new ClientService();

export function useDeleteClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteClient = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new DeleteClient(clientService);
      await useCase.execute(id);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir client');
      setLoading(false);
      throw err;
    }
  };

  return { deleteClient, loading, error };
}
