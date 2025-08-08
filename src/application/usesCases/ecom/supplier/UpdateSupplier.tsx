import type { ISupplierRepository } from "../../../../domain/repositories/ecom/supplier/ISupplierRepository";
import type { Supplier } from "../../../../domain/entities/ecom/supplier/Supplier";

export class UpdateSupplier {
    constructor(private repo: ISupplierRepository) {}

    async execute(supplier: Supplier): Promise<void> {
        return this.repo.update(supplier);
    }
}
