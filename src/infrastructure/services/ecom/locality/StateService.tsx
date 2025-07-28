import axios from 'axios';
import type {State} from '../../../../domain/entities/ecom/locality/State';
import type { IStateRepository } from '../../../../domain/repositories/ecom/locality/IState.Repositories';

export class StateService implements IStateRepository {
  private baseUrl = 'http://localhost:5124/api/State';

  async getAll(): Promise<State[]> {
    const res = await axios.get(this.baseUrl);
    return res.data;
  }
}
