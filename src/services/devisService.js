import api from './api';

export const devisService = {
  // Récupérer tous les devis
  getAll: async () => {
    const response = await api.get('/devis');
    return response.data;
  },
  
  // Récupérer un devis par ID
  getById: async (id) => {
    const response = await api.get(`/devis/${id}`);
    return response.data;
  },
  
  // Créer un nouveau devis
  create: async (devisData) => {
    const response = await api.post('/devis', devisData);
    return response.data;
  },
  
  // Mettre à jour un devis
  update: async (id, devisData) => {
    const response = await api.put(`/devis/${id}`, devisData);
    return response.data;
  },
  
  // Supprimer un devis
  delete: async (id) => {
    await api.delete(`/devis/${id}`);
  },
  
  // Récupérer les devis d'un client
  getByClientId: async (clientId) => {
    const response = await api.get(`/devis/client/${clientId}`);
    return response.data;
  },

  // NOUVELLES MÉTHODES pour la gestion des statuts

  // Changer le statut d'un devis
  updateStatus: async (id, statut) => {
    const response = await api.patch(`/devis/${id}/statut?statut=${statut}`);
    return response.data;
  },

  // Récupérer les devis par statut
  getByStatus: async (statut) => {
    const response = await api.get(`/devis/statut/${statut}`);
    return response.data;
  },

  // Récupérer tous les statuts disponibles
  getAllStatuts: async () => {
    const response = await api.get('/devis/statuts');
    return response.data;
  },

  // NOUVELLES MÉTHODES pour l'envoi automatique

  // Envoyer un devis par SMS (BROUILLON -> ENVOYE)
  envoyerParSMS: async (id, numeroTelephone) => {
    const response = await api.post(`/devis/${id}/envoyer-sms?numeroTelephone=${encodeURIComponent(numeroTelephone)}`);
    return response.data;
  },

  // Envoyer un devis par Email (BROUILLON -> ENVOYE)
  envoyerParEmail: async (id, email) => {
    const response = await api.post(`/devis/${id}/envoyer-email?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // MÉTHODES UTILITAIRES

  // Vérifier si un devis peut être envoyé
  canBeSent: (devis) => {
    return devis.statut === 'BROUILLON';
  },

  // Vérifier si un devis peut être modifié
  canBeEdited: (devis) => {
    return devis.statut === 'BROUILLON';
  },

  // Vérifier si un devis peut changer de statut manuellement
  canChangeStatus: (devis) => {
    return devis.statut === 'ENVOYE';
  },

  // Obtenir les actions possibles pour un devis
  getAvailableActions: (devis) => {
    const actions = [];
    
    if (devisService.canBeSent(devis)) {
      actions.push('SEND_SMS', 'SEND_EMAIL');
    }
    
    if (devisService.canBeEdited(devis)) {
      actions.push('EDIT');
    }
    
    if (devisService.canChangeStatus(devis)) {
      actions.push('ACCEPT', 'REFUSE', 'EXPIRE');
    }
    
    actions.push('VIEW', 'DELETE', 'DOWNLOAD_PDF');
    
    return actions;
  }
};