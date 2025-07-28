import { useEffect, useState } from 'react';
import type { Client } from '../../../../domain/entities/ecom/client/Client';
import { ClientService } from '../../../../infrastructure/services/ecom/client/ClientService';

export function useClientById(id?: number) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        const service = new ClientService();
        const data = await service.getById(id);
        setClient(data);
      } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  return { client, loading, error };
}
