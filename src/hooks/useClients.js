import { useState, useEffect } from 'react';
import { clientService } from '../services/clientService';
import toast from 'react-hot-toast';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger tous les clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAll();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Créer un client
  const createClient = async (clientData) => {
    try {
      const newClient = await clientService.create(clientData);
      setClients(prev => [...prev, newClient]);
      toast.success('Client créé avec succès !');
      return newClient;
    } catch (err) {
      toast.error('Erreur lors de la création du client');
      throw err;
    }
  };

  // Mettre à jour un client
  const updateClient = async (id, clientData) => {
    try {
      const updatedClient = await clientService.update(id, clientData);
      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
      toast.success('Client modifié avec succès !');
      return updatedClient;
    } catch (err) {
      toast.error('Erreur lors de la modification du client');
      throw err;
    }
  };

  // Supprimer un client
  const deleteClient = async (id, force = false) => {
    try {
      if (force) {
        await clientService.forceDelete(id);
      } else {
        await clientService.delete(id);
      }
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client supprimé avec succès !');
    } catch (err) {
      toast.error('Erreur lors de la suppression du client');
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
};