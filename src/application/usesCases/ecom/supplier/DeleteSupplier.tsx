import type { ISupplierRepository } from '../../../../domain/repositories/ecom/supplier/ISupplierRepository';

export class DeleteSupplier {
  constructor(private repo: ISupplierRepository) {}

  async execute(id: number): Promise<void> {
    
    return this.repo.delete(id);
  }
}
