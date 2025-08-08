import type { ISupplierRepository } from '../../../../domain/repositories/ecom/supplier/ISupplierRepository';
import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';

export class GetSupplierById {
  constructor(private repo: ISupplierRepository) {}

  async execute(id: number): Promise<Supplier | null> {
    try {
      const supplier = await this.repo.getById(id);
      return supplier ?? null;
    } catch (error) {
        console.error('Erro ao buscar fornecedor por ID:', error);
      return null;
    }
  }
}
