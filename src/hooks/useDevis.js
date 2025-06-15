import { useState, useEffect } from 'react';
import { devisService } from '../services/devisService';
import toast from 'react-hot-toast';

export const useDevis = () => {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger tous les devis
  const fetchDevis = async () => {
    try {
      setLoading(true);
      const data = await devisService.getAll();
      setDevis(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Créer un devis
  const createDevis = async (devisData) => {
    try {
      const newDevis = await devisService.create(devisData);
      setDevis(prev => [...prev, newDevis]);
      toast.success('Devis créé avec succès !');
      return newDevis;
    } catch (err) {
      toast.error('Erreur lors de la création du devis');
      throw err;
    }
  };

  // Mettre à jour un devis
  const updateDevis = async (id, devisData) => {
    try {
      const updatedDevis = await devisService.update(id, devisData);
      setDevis(prev => prev.map(d => d.id === id ? updatedDevis : d));
      toast.success('Devis modifié avec succès !');
      return updatedDevis;
    } catch (err) {
      toast.error('Erreur lors de la modification du devis');
      throw err;
    }
  };

  // Supprimer un devis
  const deleteDevis = async (id) => {
    try {
      await devisService.delete(id);
      setDevis(prev => prev.filter(d => d.id !== id));
      toast.success('Devis supprimé avec succès !');
    } catch (err) {
      toast.error('Erreur lors de la suppression du devis');
      throw err;
    }
  };

  // NOUVELLES MÉTHODES : Envoyer un devis par SMS
  const envoyerDevisParSMS = async (id, numeroTelephone) => {
    try {
      const updatedDevis = await devisService.envoyerParSMS(id, numeroTelephone);
      // Mettre à jour l'état local avec le devis mis à jour
      setDevis(prev => prev.map(d => d.id === id ? updatedDevis : d));
      toast.success('Devis envoyé par SMS avec succès !');
      return updatedDevis;
    } catch (err) {
      toast.error('Erreur lors de l\'envoi du devis par SMS');
      throw err;
    }
  };

  // Envoyer un devis par Email
  const envoyerDevisParEmail = async (id, email) => {
    try {
      const updatedDevis = await devisService.envoyerParEmail(id, email);
      // Mettre à jour l'état local avec le devis mis à jour
      setDevis(prev => prev.map(d => d.id === id ? updatedDevis : d));
      toast.success('Devis envoyé par email avec succès !');
      return updatedDevis;
    } catch (err) {
      toast.error('Erreur lors de l\'envoi du devis par email');
      throw err;
    }
  };

  // Mettre à jour le statut d'un devis
  const updateDevisStatus = async (id, statut) => {
    try {
      const updatedDevis = await devisService.updateStatus(id, statut);
      setDevis(prev => prev.map(d => d.id === id ? updatedDevis : d));
      toast.success('Statut du devis mis à jour avec succès !');
      return updatedDevis;
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du statut');
      throw err;
    }
  };

  // Recharger les données depuis le serveur (pour forcer la synchronisation)
  const refreshDevis = async () => {
    await fetchDevis();
    toast.success('Données actualisées !');
  };

  useEffect(() => {
    fetchDevis();
  }, []);

  return {
    devis,
    loading,
    error,
    fetchDevis,
    createDevis,
    updateDevis,
    deleteDevis,
    // Nouvelles méthodes
    envoyerDevisParSMS,
    envoyerDevisParEmail,
    updateDevisStatus,
    refreshDevis,
  };
};