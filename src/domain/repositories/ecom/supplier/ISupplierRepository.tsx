import { Supplier } from "../../../entities/ecom/supplier/Supplier";

export interface ISupplierRepository {
  getAll(): Promise<Supplier[]>;
  getById(id: number): Promise<Supplier>;
  create(supplier: Supplier): Promise<Supplier>;  
  update(supplier: Supplier): Promise<void>;    
  delete(id: number): Promise<void>;
} 