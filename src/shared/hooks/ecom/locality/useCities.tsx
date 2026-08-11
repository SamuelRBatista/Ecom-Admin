import { useEffect, useState } from 'react';
import type{ City } from '../../../../domain/entities/ecom/locality/City';
import { CityService } from '../../../../infrastructure/services/ecom/locality/CityService';

const cityService = new CityService();

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const result = await cityService.getAll();
        setCities(result);
      } catch (err) {
        setError('Erro ao carregar cidades');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
};