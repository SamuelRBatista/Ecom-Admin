import type { IClientRepository } from "../../../../domain/repositories/ecom/client/IClientRepository";
import type { Client } from "../../../../domain/entities/ecom/client/Client";

export class UpdateClient {
    constructor(private repo: IClientRepository) {}

    async execute(client: Client): Promise<void> {
        return this.repo.update(client);
    }
}
