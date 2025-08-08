import { useState } from 'react';
import { UpdateClient } from '../../../../application/usesCases/ecom/client/UpdateClient';
import { ClientService } from '../../../../infrastructure/services/ecom/client/ClientService';
import type { Client } from '../../../../domain/entities/ecom/client/Client';

const clientService = new ClientService();

export function useUpdateClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateClient = async (client: Client): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = new UpdateClient(clientService);
      await useCase.execute(client);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar client');
      setLoading(false);
      throw err;
    }
  };

  return { updateClient, loading, error };
}
