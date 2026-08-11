import { useState, useEffect, useCallback } from 'react';

import type { Client } from '../../../../domain/entities/ecom/client/Client';

import { ClientService } from '../../../../infrastructure/services/ecom/client/ClientService';

import { GetAllClients } from '../../../../application/usesCases/ecom/client/GetAllClients';
import { GetClientById } from '../../../../application/usesCases/ecom/client/GetClientById';
import { CreateClient } from '../../../../application/usesCases/ecom/client/CreateClient';
import { UpdateClient } from '../../../../application/usesCases/ecom/client/UpdateClient';
import { DeleteClient } from '../../../../application/usesCases/ecom/client/DeleteClient';

const service = new ClientService();

export function useClient() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    /**
     * Buscar todos os clientes
     */
    const loadClients = useCallback(async () => {
        setLoading(true);
        try {
            const useCase = new GetAllClients(service);
            const data = await useCase.execute();
            setClients(data);
            setError(null);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao carregar clientes');            }
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        loadClients();
    }, [loadClients]);
    /**
     * Criar cliente
     */
    const createClient = async (
        client: Client
    ): Promise<Client | null> => {
        setLoading(true);
        try {
            const useCase = new CreateClient(service);
            const created = await useCase.execute(client);
            // Atualiza lista automaticamente
            await loadClients();
            return created;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao criar cliente');
            }
            return null;
        } finally {
            setLoading(false);
        }
    };
    /**
     * Atualizar cliente
     */
    const updateClient = async (
        client: Client
    ): Promise<void> => {
        setLoading(true);
        try {
            const useCase = new UpdateClient(service);
            await useCase.execute(client);
            // Recarrega lista
            await loadClients();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao atualizar cliente');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };
    /**
     * Excluir cliente
     */
    const deleteClient = async (
        id: number
    ): Promise<void> => {
        setLoading(true);
        try {
            const useCase = new DeleteClient(service);
            await useCase.execute(id);
            // Atualiza tabela
            await loadClients();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao excluir cliente');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };
    /**
     * Buscar cliente por ID
     */
    const getClientById = async (
        id: number
    ): Promise<Client | null> => {
        try {
            const useCase = new GetClientById(service);
            return await useCase.execute(id);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Erro ao buscar cliente');
            }
            return null;
        }
    };

    return {
        clients,
        loading,
        error,
        loadClients,
        createClient,
        updateClient,
        deleteClient,
        getClientById
    };
}