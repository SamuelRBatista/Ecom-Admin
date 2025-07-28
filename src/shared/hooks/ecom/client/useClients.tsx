import { useState, useEffect } from 'react';
import type { Client } from '../../../../domain/entities/ecom/client/Client';
import { ClientService } from '../../../../infrastructure/services/ecom/client/ClientService';

export default function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const service = new ClientService();
        const data = await service.getAll();
        setClients(data);
      } catch (err) {
        console.error('Failed to fetch clients', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, loading, error };
}
