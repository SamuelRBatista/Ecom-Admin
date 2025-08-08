import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './styles';

import { useStates } from '../../../../shared/hooks/ecom/locality/useStates';
import { useCities } from '../../../../shared/hooks/ecom/locality/useCities';
import { useAppContext } from '../../../../shared/contexts/ContextProvider'; // Importa o contexto
import type { Supplier } from '../../../../domain/entities/ecom/supplier/Supplier';
import SidebarLayout from '../../../layouts/components/SidebarLayout';

const SupplierDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { supplier } = useAppContext(); // pega do contexto

  const [supplierData, setSupplierData] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  const { states } = useStates();
  const { cities } = useCities(supplierData?.stateId ?? 0);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await supplier.getSupplierById(Number(id));
        setSupplierData(data);
      } catch (error) {
        console.error('Erro ao buscar fornecedor:', error);
        setSupplierData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // só id como dependência

  if (loading) return <p>Carregando detalhes...</p>;
  if (!supplierData) return <p>Forncedor não encontrado.</p>;

  const stateName = states.find((state) => state.id === supplierData.stateId)?.name || '';
  const cityName = cities.find((city) => city.id === supplierData.cityId)?.name || '';

  return (
    <SidebarLayout isCollapsed={false}>
      <div style={styles.cadastroFormContainer}>
        <h2 style={styles.title}>Detalhes do Cliente</h2>

        <div style={styles.formRow}>
          <label>Nome:</label>
          <span>{supplierData.name}</span>

          <label>Cpf:</label>
          <span>{supplierData.cnpj}</span>
        </div>

        <div style={styles.formRow}>
          <label>E-mail:</label>
          <span>{supplierData.email}</span>

          <label>Telefone:</label>
          <span>{supplierData.phoneNumber}</span>

          <label>Cep:</label>
          <span>{supplierData.zipCode}</span>

          <label>Endereço:</label>
          <span>{supplierData.address}</span>

          <label>Bairro:</label>
          <span>{supplierData.neighborhood}</span>
        </div>

        <div style={styles.formRow}>
          <label>Estado:</label>
          <span>{stateName}</span>

          <label>Cidade:</label>
          <span>{cityName}</span>
        </div>

        <div style={styles.formRow}>
          <button
            type="button"
            onClick={() => navigate('/panel/client')}
            style={styles.btnCancel}
          >
            Voltar
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SupplierDetailsPage;
