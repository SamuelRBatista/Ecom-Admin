import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {TextField, MenuItem, Select, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import type { Client } from '../../../../domain/entities/ecom/client/Client';
import { ClientService } from '../../../../infrastructure/services/ecom/client/ClientService';

import { useStates } from '../../../../shared/hooks/ecom/locality/useStates';
import { useCities } from '../../../../shared/hooks/ecom/locality/useCities';

import SidebarLayout from '../../../layouts/components/SidebarLayout';
import styles from './styles';

type ClientFormData = Omit<Client, 'id'>;

export default function ClientEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { states } = useStates();
  const [formData, setFormData] = useState<ClientFormData>({
  name:'', cpf:'', email:'', phoneNumber:'', address:'',
  neighborhood:'', zipCode:'', stateId:0, cityId:0,
});
 const { cities } = useCities(formData.stateId);
  const clientService = new ClientService();

  useEffect(() => {
    console.log('ID dentro do useEffect:', id);
    if (id) {
      const loadClient = async () => {
        try {
          const client = await clientService.getById(parseInt(id));
          console.log('Cliente recebido do serviço:', client);
          setFormData(client);
        } catch (error) {
          console.error('Erro ao buscar client:', error);
        }
      };
      loadClient();
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newClient: Client = {
            id: 0,
            ...formData,
       };
      await clientService.update(newClient);
      navigate('/panel/client');
    } catch (err) {
      console.error('Erro ao atualizar produto', err);
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
  const { name, value } = e.target;
  const newValue = Number(value);

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === 'stateId' ? { cityId: 0 } : {}) // reseta cidade ao trocar estado
    }));
  };
      

  return (
    <SidebarLayout isCollapsed={false}>
      <div style={styles.cadastroFormContainer}>
        <h2 style={styles.title}>Editar Cliente</h2>
        <form onSubmit={handleSubmit} style={styles.cadastroForm}>
          <div style={styles.formGroup}>                 
            <TextField
                id="name"
                type="text"
                name="name"
                label="Nome"
                value={formData.name}
                onChange={handleInputChange}
                required                     
                placeholder="Digite o nome do cliente" 
                style={styles.formControl}
            />                 
          </div>
          <div style={styles.formRow}>
              <div style={styles.halfWidth}>                     
                <TextField
                    id="cpf"
                    label="Cpf:"
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required 
                    style={styles.formControl}
                /> 
              </div>
              <div style={styles.halfWidth}>                     
                <TextField
                    id="email"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required                        
                    // placeholder=""
                    label="Email:"
                    style={styles.formControl}
                />
              </div>
              <div style={styles.halfWidth}>                      
                  <TextField
                      id="phoneNumber"
                      label="Telefone:"
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required                            
                      placeholder="0"
                      style={styles.formControl}
                  />                                             
              </div>
          </div>
          <div style={styles.formRow}>                   
            <div style={styles.halfWidth}>                       
                <TextField
                    id="address"
                    label="Endereço:"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}  
                    style={styles.formControl}                                                  
                />             
            </div>
          </div>
          <div style={styles.formGroup}>                   
            <TextField
                id="neighborhood"
                label="Endereço:"
                name="neighborhood"
                multiline
                maxRows={20}
                value={formData.neighborhood}
                onChange={handleInputChange}
                style={styles.formControl}
            />
          </div>
            <div style={styles.formGroup}>                   
              <TextField
                  id="zipCode"
                  label="Cep:"
                  name="zipCode"
                  multiline
                  maxRows={20}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  style={styles.formControl}
              />
          </div>

          <div style={styles.halfWidth}>                  
            <InputLabel id="application-status-label">Estado</InputLabel>
              <Select
              labelId="application-status-label"
              id="stateId"
              name="stateId"
              value={formData.stateId}
              onChange={handleSelectChange}
              label="Estado"
              style={styles.formControl}
              >
              <MenuItem value={0}>Selecione o Estado</MenuItem>
              {states && states.length > 0 ? (
                  states.map(state => (
                  <MenuItem key={state.id} value={state.id}>
                      {state.name}
                  </MenuItem>
                  ))
              ) : (
                  <MenuItem disabled>Nenhuma Estado encontrado</MenuItem>
              )}
              </Select>
          </div>
          <div style={styles.halfWidth}>                  
                <InputLabel id="application-status-label">Cidade</InputLabel>
                    <Select
                    labelId="application-status-label"
                    id="cityId"
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleSelectChange}
                    label="Cidade"
                    style={styles.formControl}
                    >
                    <MenuItem value={0}>Selecione o Cidade</MenuItem>
                    {cities && cities.length > 0 ? (
                        cities.map(cities => (
                        <MenuItem key={cities.id} value={cities.id}>
                            {cities.name}
                        </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>Nenhuma cidade encontrado</MenuItem>
                    )}
                    </Select>
          </div>
          <div style={styles.formActions}>
              <button type="submit" style={styles.btnSubmit}>Alterar</button>
              <button type="button"  onClick={() => navigate('/panel/client')} style={styles.btnCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </SidebarLayout>
  );
}
