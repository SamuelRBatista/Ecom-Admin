import { useNavigate, useParams } from 'react-router-dom';
import styles from './styles';
import { useStates } from '../../../../shared/hooks/ecom/locality/useStates';
import { useCities } from '../../../../shared/hooks/ecom/locality/useCities';
import { useClientById } from '../../../../shared/hooks/ecom/client/useClientById';
import SidebarLayout from '../../../layouts/components/SidebarLayout';

const ClientDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientId = id ? Number(id) : undefined;

  const { client, loading } = useClientById(clientId);
  const { states } = useStates();
  const { cities } = useCities(client?.stateId ?? 0);

  const stateName = states.find(state => state.id === client?.stateId)?.name || '';
  const cityName = cities.find(city => city.id === client?.cityId)?.name || '';

  if (loading) return <p>Carregando detalhes...</p>;
  if (!client) return <p>Cliente não encontrado.</p>;

  return (
    <SidebarLayout isCollapsed={false}>
      <div style={styles.cadastroFormContainer}>
        <h2 style={styles.title}>Detalhes do Cliente</h2>

        <div style={styles.formRow}>
          <label>Nome:</label>
          <span>{client.name}</span>

          <label>Cpf:</label>
          <span>{client.cpf}</span>
        </div>

        <div style={styles.formRow}>
          <label>E-mail:</label>
          <span>{client.email}</span>

          <label>Telefone:</label>
          <span>{client.phoneNumber}</span>

          <label>Cep:</label>
          <span>{client.zipCode}</span>

          <label>Endereço:</label>
          <span>{client.address}</span>

          <label>Bairro:</label>
          <span>{client.neighborhood}</span>
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
            onClick={() => navigate('/panel/product')}
            style={styles.btnCancel}
          >
            Voltar
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ClientDetailsPage;
