import type { ISupplierRepository } from '../../../../domain/repositories/ecom/supplier/ISupplierRepository';

export class GetAllSuppliers {
  constructor(public repo: ISupplierRepository) {}

  async execute() {
    return this.repo.getAll();
  }
}
