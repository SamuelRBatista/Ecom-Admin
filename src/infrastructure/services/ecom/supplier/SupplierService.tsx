import axios from "axios";
import { ISupplierRepository } from "../../../../domain/repositories/ecom/supplier/ISupplierRepository";
import { Supplier } from "../../../../domain/entities/ecom/supplier/Supplier";

export class SupplierService  implements ISupplierRepository{

    private baseUrl = 'http://localhost:5124/api/Supplier';

    async getAll(): Promise<Supplier[]> {
        const response = await axios.get(this.baseUrl);
        return response.data;
    }

    async getById(id: number): Promise<Supplier> {
      const response = await axios.get(`${this.baseUrl}/${id}`);
      return response.data;
    }

    async create(supplier: Supplier): Promise<Supplier> {
       const response = await axios.post<Supplier>(this.baseUrl, supplier, {
            headers: {
                'Content-Type': 'application/json',  // usa JSON
            },
      });
      return response.data;
    }

    async update(supplier: Supplier): Promise<void> {
        await axios.put(`${this.baseUrl}/${supplier.id}`, supplier, {
        headers: {
        'Content-Type': 'application/json',
        },
     });
    }
    async delete(id: number): Promise<void> {
         await axios.delete(`${this.baseUrl}/${id}`);
    }
}