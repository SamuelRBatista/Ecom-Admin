import { useEffect, useState } from 'react';
import type{ State } from '../../../../domain/entities/ecom/locality/State';
import { StateService } from '../../../../infrastructure/services/ecom/locality/StateService';

const stateService = new StateService();

export const useStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const result = await stateService.getAll();
        setStates(result);
      } catch (err) {
        setError('Erro ao carregar estados');
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, loading, error };
};
