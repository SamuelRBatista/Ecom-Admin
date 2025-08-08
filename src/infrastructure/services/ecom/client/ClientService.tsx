import axios from 'axios';
import type { Client } from '../../../../domain/entities/ecom/client/Client';
import type { IClientRepository } from '../../../../domain/repositories/ecom/client/IClientRepository';

export class ClientService implements IClientRepository {
  private baseUrl = 'http://localhost:5124/api/Client';

  async getAll(): Promise<Client[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async getById(id: number): Promise<Client> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(client: Client): Promise<Client> {
    const response = await axios.post<Client>(this.baseUrl, client, {
      headers: {
        'Content-Type': 'application/json',  // usa JSON
      },
    });
    return response.data;
  }

  async update(client: Client): Promise<void> {
    await axios.put(`${this.baseUrl}/${client.id}`, client, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}