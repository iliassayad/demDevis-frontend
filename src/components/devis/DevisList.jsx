import { useState } from 'react';
import { Container, Row, Col, Button, InputGroup, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useDevis } from '../../hooks/useDevis';
import DevisTable from './DevisTable';
import DevisForm from './DevisForm';
import ConfirmModal from '../common/ConfirmModal';
import { FORMULES } from '../../utils/constants';

const DevisList = () => {
  const { devis, loading, error, createDevis, updateDevis, deleteDevis } = useDevis();
  
  const [showForm, setShowForm] = useState(false);
  const [editingDevis, setEditingDevis] = useState(null);
  const [deletingDevis, setDeletingDevis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormule, setFilterFormule] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Filtrer les devis
  const filteredDevis = devis.filter(d => {
    const matchSearch = !searchTerm || 
      d.clientNom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.villeDepart?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.villeArrivee?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchFormule = !filterFormule || d.formule === filterFormule;
    
    return matchSearch && matchFormule;
  });

  const handleCreateDevis = () => {
    setEditingDevis(null);
    setShowForm(true);
  };

  const handleEditDevis = (devis) => {
    setEditingDevis(devis);
    setShowForm(true);
  };

  const handleSubmitForm = async (data) => {
    setFormLoading(true);
    try {
      if (editingDevis) {
        await updateDevis(editingDevis.id, data);
      } else {
        await createDevis(data);
      }
      setShowForm(false);
      setEditingDevis(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDevis = (devis) => {
    setDeletingDevis(devis);
  };

  const confirmDelete = async () => {
    if (deletingDevis) {
      try {
        await deleteDevis(deletingDevis.id);
        setDeletingDevis(null);
      } catch (error) {
        // L'erreur est gérée par le hook
      }
    }
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Erreur lors du chargement des devis : {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4 px-3 px-lg-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="mb-1">Gestion des Devis</h2>
              <p className="text-muted mb-0">
                {devis.length} devis au total
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={handleCreateDevis}
              className="d-flex align-items-center"
            >
              <FiPlus className="me-2" />
              Nouveau Devis
            </Button>
          </div>
        </Col>
      </Row>

      {/* Filtres */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Rechercher par client, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterFormule}
            onChange={(e) => setFilterFormule(e.target.value)}
          >
            <option value="">Toutes les formules</option>
            {FORMULES.map(formule => (
              <option key={formule.value} value={formule.value}>
                {formule.label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={5}>
          <div className="text-center">
            <Badge bg="info">
              {filteredDevis.length} résultat{filteredDevis.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Chargement des devis...</p>
          </div>
        ) : filteredDevis.length === 0 ? (
          <Alert variant="info" className="text-center m-4">
            {searchTerm || filterFormule ? 'Aucun devis trouvé pour ces critères.' : 'Aucun devis enregistré.'}
          </Alert>
        ) : (
          <DevisTable
            devis={filteredDevis}
            onEdit={handleEditDevis}
            onDelete={handleDeleteDevis}
            loading={loading}
          />
        )}
      </div>

      {/* Modal Formulaire */}
      <DevisForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingDevis(null);
        }}
        onSubmit={handleSubmitForm}
        devis={editingDevis}
        loading={formLoading}
      />

      {/* Modal Confirmation Suppression */}
      <ConfirmModal
        show={!!deletingDevis}
        onHide={() => setDeletingDevis(null)}
        onConfirm={confirmDelete}
        title="Supprimer le devis"
        message={`Êtes-vous sûr de vouloir supprimer ce devis ?`}
      />
    </Container>
  );
};

export default DevisList;