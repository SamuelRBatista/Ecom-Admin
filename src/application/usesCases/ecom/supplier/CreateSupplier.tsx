import type { ISupplierRepository } from '../../../../domain/repositories/ecom/supplier/ISupplierRepository';
import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';

export class CreateSupplier {
  constructor(private repo: ISupplierRepository) {}

  async execute(supplier: Supplier): Promise<Supplier> {
    return this.repo.create(supplier);
  }
}
