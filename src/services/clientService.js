import api from './api';

export const clientService = {
  // Récupérer tous les clients
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },
  
  // Récupérer un client par ID
  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  
  // Créer un nouveau client
  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  
  // Mettre à jour un client
  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },
  
  // Supprimer un client
  delete: async (id) => {
    await api.delete(`/clients/${id}`);
  },
  
  // Suppression forcée
  forceDelete: async (id) => {
    await api.delete(`/clients/${id}/force`);
  },
};