import { useState } from 'react';
import { ClientService } from '../../../../infrastructure/services/ecom/client/ClientService';
import { CreateClient } from '../../../../application/usesCases/ecom/client/CreateClient';
import type { Client } from '../../../../domain/entities/ecom/client/Client';

export function useCreateClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (client: Client): Promise<Client | null> => {
    setLoading(true);
    setError(null);
    try {
      const service = new ClientService();
      const createClient = new CreateClient(service);
      const createdClient = await createClient.execute(client);
      return createdClient;
    } catch (e) {
      setError('Erro ao criar cliente');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
