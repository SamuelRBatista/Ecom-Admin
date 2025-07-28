import { useEffect, useState } from 'react';
import type{ City } from '../../../../domain/entities/ecom/locality/City';
import { CityService } from '../../../../infrastructure/services/ecom/locality/CityService';

const cityService = new CityService();

export const useCities = (stateId?: number) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stateId === undefined) return;

    const fetchCities = async () => {
      setLoading(true);
      try {
        const result = await cityService.getByStateId(stateId);
        setCities(result);
      } catch (err) {
        setError('Erro ao carregar cidades');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [stateId]);

  return { cities, loading, error };
};
