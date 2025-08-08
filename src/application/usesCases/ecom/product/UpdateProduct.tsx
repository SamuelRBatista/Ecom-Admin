import type { IProductRepository } from "../../../../domain/repositories/ecom/product/IProductRepository";

export class UpdateProduct {
    constructor(private repo: IProductRepository) {}

    async execute(formData: FormData): Promise<void> {
        return this.repo.update(formData);
    }
}