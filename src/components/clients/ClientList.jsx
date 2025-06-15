import { useState } from 'react';
import { Container, Row, Col, Button, InputGroup, Form, Alert, Spinner } from 'react-bootstrap';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useClients } from '../../hooks/useClients';
import { useDevis } from '../../hooks/useDevis'; // Import ajouté
import ClientCard from './ClientCard';
import ClientForm from './ClientForm';
import DevisForm from '../devis/DevisForm'; // Import ajouté
import ConfirmModal from '../common/ConfirmModal';

const ClientList = () => {
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients();
  const { createDevis } = useDevis(); // Hook ajouté pour créer des devis
  
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // États ajoutés pour la gestion des devis
  const [showDevisForm, setShowDevisForm] = useState(false);
  const [selectedClientForDevis, setSelectedClientForDevis] = useState(null);
  const [devisLoading, setDevisLoading] = useState(false);

  // Filtrer les clients selon la recherche
  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleSubmitForm = async (data) => {
    setFormLoading(true);
    try {
      if (editingClient) {
        await updateClient(editingClient.id, data);
      } else {
        await createClient(data);
      }
      setShowForm(false);
      setEditingClient(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClient = (client) => {
    setDeletingClient(client);
  };

  const confirmDelete = async (force = false) => {
    if (deletingClient) {
      try {
        await deleteClient(deletingClient.id, force);
        setDeletingClient(null);
      } catch (error) {
        // L'erreur est gérée par le hook
      }
    }
  };

  // NOUVELLES FONCTIONS pour la gestion des devis
  const handleCreateDevis = (client) => {
    setSelectedClientForDevis(client);
    setShowDevisForm(true);
  };

  const handleCloseDevisForm = () => {
    setShowDevisForm(false);
    setSelectedClientForDevis(null);
  };

  const handleSubmitDevis = async (devisData) => {
    setDevisLoading(true);
    try {
      await createDevis(devisData);
      setShowDevisForm(false);
      setSelectedClientForDevis(null);
    } catch (error) {
      // L'erreur est gérée par le hook useDevis avec toast
    } finally {
      setDevisLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement des clients...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Erreur lors du chargement des clients : {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="mb-1">Gestion des Clients</h2>
              <p className="text-muted mb-0">
                {clients.length} client{clients.length > 1 ? 's' : ''} au total
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={handleCreateClient}
              className="d-flex align-items-center"
            >
              <FiPlus className="me-2" />
              Nouveau Client
            </Button>
          </div>
        </Col>
      </Row>

      {/* Barre de recherche */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* Liste des clients */}
      {filteredClients.length === 0 ? (
        <Alert variant="info" className="text-center">
          {searchTerm ? 'Aucun client trouvé pour cette recherche.' : 'Aucun client enregistré.'}
        </Alert>
      ) : (
        <Row>
          {filteredClients.map((client) => (
            <Col key={client.id} xs={12} md={6} lg={4} className="mb-4">
              <ClientCard
                client={client}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
                onCreateDevis={handleCreateDevis} // Prop ajoutée
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modal Formulaire Client */}
      <ClientForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingClient(null);
        }}
        onSubmit={handleSubmitForm}
        client={editingClient}
        loading={formLoading}
      />

      {/* NOUVEAU : Modal Formulaire Devis */}
      <DevisForm
        show={showDevisForm}
        onHide={handleCloseDevisForm}
        onSubmit={handleSubmitDevis}
        preselectedClient={selectedClientForDevis}
        loading={devisLoading}
      />

      {/* Modal Confirmation Suppression */}
      <ConfirmModal
        show={!!deletingClient}
        onHide={() => setDeletingClient(null)}
        onConfirm={() => confirmDelete(false)}
        onForceConfirm={() => confirmDelete(true)}
        title="Supprimer le client"
        message={`Êtes-vous sûr de vouloir supprimer le client "${deletingClient?.nom}" ?`}
        showForceOption={deletingClient?.nombreDevis > 0}
        forceMessage={`Ce client a ${deletingClient?.nombreDevis} devis associé(s). Voulez-vous forcer la suppression ?`}
      />
    </Container>
  );
};

export default ClientList;