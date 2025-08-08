import { useState, useEffect } from 'react';
import type { Client } from '../../../../domain/entities/ecom/client/Client';
import { GetAllClients } from '../../../../application/usesCases/ecom/client/GetAllClients';
import { ClientService } from '../../../../infrastructure/services/ecom/client/ClientService';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const useCase = new GetAllClients(new ClientService());
    useCase.execute()
      .then(setClients)
      .catch(() => setError(true))
      .finally(() => setLoading(false));      
      }, []);
  return { clients, loading, error };
}
