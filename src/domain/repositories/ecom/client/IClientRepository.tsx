import type { Client } from '../../../entities/ecom/client/Client';

export interface IClientRepository {
  getAll(): Promise<Client[]>;
  getById(id: number): Promise<Client>;
  create(client: Client): Promise<Client>;  
  update(client: Client): Promise<void>;    
  delete(id: number): Promise<void>;
}
