import axios from 'axios';

import type {City} from '../../../../domain/entities/ecom/locality/City';
import type { ICityRepository } from '../../../../domain/repositories/ecom/locality/ICityRepositories';

export class CityService implements ICityRepository {

  private baseUrl = 'http://localhost:5124/api/City';

  async getAll(): Promise<City[]> {
    const res = await axios.get(this.baseUrl);
    return res.data;
  }

  async getByStateId(stateId: number): Promise<City[]> {
    const all = await this.getAll();
    return all.filter(city => city.stateId === stateId);
  }
}