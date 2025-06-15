import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { 
  FiUser, 
  FiCalendar, 
  FiMapPin, 
  FiHome, 
  FiPackage, 
  FiDollarSign, 
  FiFileText,
  FiX,
  FiSave,
  FiClock,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import { clientService } from '../../services/clientService';
import { FORMULES } from '../../utils/constants';

const DevisForm = ({ 
  show, 
  onHide, 
  onSubmit, 
  devis = null, 
  loading = false, 
  preselectedClient = null // Nouveau prop pour le client pré-sélectionné
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm();

  const [submitError, setSubmitError] = useState('');
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);

  // Watch pour calcul automatique des arrhes
  const prixTTC = watch('prixTTC', 0);
  const pourcentageArrhes = watch('pourcentageArrhes', 0);

  // Calculer automatiquement le montant des arrhes
  useEffect(() => {
    if (prixTTC && pourcentageArrhes) {
      const montant = (prixTTC * pourcentageArrhes) / 100;
      setValue('montantArrhes', montant.toFixed(2));
    } else {
      setValue('montantArrhes', 0);
    }
  }, [prixTTC, pourcentageArrhes, setValue]);

  // Charger les clients (seulement si pas de client pré-sélectionné)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const data = await clientService.getAll();
        setClients(data);
      } catch (error) {
        console.error('Erreur chargement clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    if (show && !preselectedClient) {
      fetchClients();
    }
  }, [show, preselectedClient]);

  // Reset du formulaire
  useEffect(() => {
    if (show) {
      if (devis) {
        // Mode édition
        reset({
          ...devis,
          dateDevis: devis.dateDevis ? devis.dateDevis.split('T')[0] : '',
          dateDepart: devis.dateDepart ? devis.dateDepart.split('T')[0] : '',
          dateArrivee: devis.dateArrivee ? devis.dateArrivee.split('T')[0] : '',
          dateDepartMin: devis.dateDepartMin ? devis.dateDepartMin.split('T')[0] : '',
          dateDepartMax: devis.dateDepartMax ? devis.dateDepartMax.split('T')[0] : '',
          dateArriveeMin: devis.dateArriveeMin ? devis.dateArriveeMin.split('T')[0] : '',
          dateArriveeMax: devis.dateArriveeMax ? devis.dateArriveeMax.split('T')[0] : '',
        });
      } else {
        // Mode création
        reset({
          clientId: preselectedClient?.id || '',
          dateDevis: new Date().toISOString().split('T')[0],
          dateDepartFlexible: false,
          dateArriveeFlexible: false,
          adresseDepart: '',
          villeDepart: '',
          adresseArrivee: '',
          villeArrivee: '',
          habitationDepart: '',
          habitationArrivee: '',
          volume: '',
          formule: 'ECONOMIC',
          prixTTC: '',
          pourcentageArrhes: 0,
          montantArrhes: 0,
          observation: ''
        });
      }
      setSubmitError('');
    }
  }, [show, devis, reset, preselectedClient]);

  const handleClose = () => {
    reset();
    setSubmitError('');
    onHide();
  };

  const handleFormSubmit = async (data) => {
    try {
      setSubmitError('');
      await onSubmit(data);
      reset();
      onHide();
    } catch (error) {
      setSubmitError(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Header */}
        <Modal.Header className="border-bottom bg-light">
          <Modal.Title className="d-flex align-items-center">
            <FiFileText className="me-2 text-primary" size={20} />
            {devis ? 'Modifier le devis' : 'Nouveau devis'}
            {preselectedClient && (
              <span className="text-muted small ms-2">
                pour {preselectedClient.nom}
              </span>
            )}
          </Modal.Title>
          <Button variant="outline-secondary" onClick={handleClose} className="border-0">
            <FiX size={18} />
          </Button>
        </Modal.Header>

        <Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {submitError && (
            <Alert variant="danger" className="mb-4">
              {submitError}
            </Alert>
          )}

          {/* Client et Date */}
          <div className="mb-4">
            <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
              <FiUser className="me-2" size={16} />
              Informations générales
            </h6>
            <Row>
              <Col md={6}>
                {preselectedClient ? (
                  // Affichage du client pré-sélectionné
                  <div className="border rounded p-3 bg-light">
                    <Form.Label className="mb-2">Client sélectionné</Form.Label>
                    <div className="mb-2">
                      <strong className="text-dark">{preselectedClient.nom}</strong>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <div className="d-flex align-items-center text-muted small">
                        <FiMail className="me-2" size={14} />
                        {preselectedClient.email}
                      </div>
                      {preselectedClient.telephone && (
                        <div className="d-flex align-items-center text-muted small">
                          <FiPhone className="me-2" size={14} />
                          {preselectedClient.telephone}
                        </div>
                      )}
                    </div>
                    {/* Input caché pour le clientId */}
                    <input
                      type="hidden"
                      {...register('clientId', { required: 'Le client est obligatoire' })}
                    />
                  </div>
                ) : (
                  // Liste déroulante normale
                  <Form.Group className="mb-3">
                    <Form.Label>Client *</Form.Label>
                    <Form.Select
                      {...register('clientId', { required: 'Le client est obligatoire' })}
                      isInvalid={!!errors.clientId}
                      disabled={loadingClients}
                    >
                      <option value="">
                        {loadingClients ? 'Chargement...' : 'Sélectionner un client'}
                      </option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.nom} - {client.email}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.clientId?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FiCalendar className="me-1" size={14} />
                    Date du devis *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    {...register('dateDevis', { required: 'La date est obligatoire' })}
                    isInvalid={!!errors.dateDevis}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dateDevis?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <hr className="my-4" />

          {/* Adresses */}
          <div className="mb-4">
            <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
              <FiMapPin className="me-2" size={16} />
              Adresses
            </h6>
            <Row>
              <Col md={6}>
                <div className="border rounded p-3 mb-3 mb-md-0">
                  <div className="fw-medium mb-3 d-flex align-items-center">
                    <FiMapPin className="me-2 text-muted" size={14} />
                    Départ
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Adresse *</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('adresseDepart', { required: 'L\'adresse de départ est obligatoire' })}
                      isInvalid={!!errors.adresseDepart}
                      placeholder="123 rue de la Paix"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.adresseDepart?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ville *</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('villeDepart', { required: 'La ville de départ est obligatoire' })}
                      isInvalid={!!errors.villeDepart}
                      placeholder="Paris"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.villeDepart?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      <FiHome className="me-1" size={14} />
                      Type de logement
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('habitationDepart')}
                      placeholder="Appartement T3, Maison..."
                    />
                  </Form.Group>
                </div>
              </Col>
              <Col md={6}>
                <div className="border rounded p-3">
                  <div className="fw-medium mb-3 d-flex align-items-center">
                    <FiMapPin className="me-2 text-muted" size={14} />
                    Arrivée
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Adresse *</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('adresseArrivee', { required: 'L\'adresse d\'arrivée est obligatoire' })}
                      isInvalid={!!errors.adresseArrivee}
                      placeholder="456 avenue des Champs"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.adresseArrivee?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ville *</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('villeArrivee', { required: 'La ville d\'arrivée est obligatoire' })}
                      isInvalid={!!errors.villeArrivee}
                      placeholder="Lyon"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.villeArrivee?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      <FiHome className="me-1" size={14} />
                      Type de logement
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('habitationArrivee')}
                      placeholder="Maison, Studio..."
                    />
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </div>

          <hr className="my-4" />

          {/* Planning */}
          <div className="mb-4">
            <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
              <FiCalendar className="me-2" size={16} />
              Planning
            </h6>
            
            {/* Dates de départ */}
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center mb-3">
                <FiClock className="me-2 text-muted" size={16} />
                <Form.Check
                  type="checkbox"
                  {...register('dateDepartFlexible')}
                  label="Dates de départ flexibles"
                  className="mb-0"
                />
              </div>
              
              {!watch('dateDepartFlexible') ? (
                <Form.Group>
                  <Form.Label>Date de départ</Form.Label>
                  <Form.Control
                    type="date"
                    {...register('dateDepart')}
                  />
                </Form.Group>
              ) : (
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date minimum</Form.Label>
                      <Form.Control
                        type="date"
                        {...register('dateDepartMin')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date maximum</Form.Label>
                      <Form.Control
                        type="date"
                        {...register('dateDepartMax')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </div>

            {/* Dates d'arrivée */}
            <div className="border rounded p-3">
              <div className="d-flex align-items-center mb-3">
                <FiClock className="me-2 text-muted" size={16} />
                <Form.Check
                  type="checkbox"
                  {...register('dateArriveeFlexible')}
                  label="Dates d'arrivée flexibles"
                  className="mb-0"
                />
              </div>
              
              {!watch('dateArriveeFlexible') ? (
                <Form.Group>
                  <Form.Label>Date d'arrivée</Form.Label>
                  <Form.Control
                    type="date"
                    {...register('dateArrivee')}
                  />
                </Form.Group>
              ) : (
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date minimum</Form.Label>
                      <Form.Control
                        type="date"
                        {...register('dateArriveeMin')}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date maximum</Form.Label>
                      <Form.Control
                        type="date"
                        {...register('dateArriveeMax')}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* Volume et Formule */}
          <div className="mb-4">
            <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
              <FiPackage className="me-2" size={16} />
              Détails
            </h6>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Volume (m³) *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      {...register('volume', { 
                        required: 'Le volume est obligatoire',
                        min: { value: 1, message: 'Le volume doit être supérieur à 0' }
                      })}
                      isInvalid={!!errors.volume}
                      placeholder="50"
                    />
                    <InputGroup.Text>m³</InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.volume?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Formule *</Form.Label>
                  <Form.Select
                    {...register('formule', { required: 'La formule est obligatoire' })}
                    isInvalid={!!errors.formule}
                  >
                    {FORMULES.map(formule => (
                      <option key={formule.value} value={formule.value}>
                        {formule.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.formule?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <hr className="my-4" />

          {/* Prix */}
          <div className="mb-4">
            <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
              <FiDollarSign className="me-2" size={16} />
              Tarification
            </h6>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Prix TTC (€) *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      step="0.01"
                      {...register('prixTTC', { 
                        required: 'Le prix est obligatoire',
                        min: { value: 0, message: 'Le prix doit être positif' }
                      })}
                      isInvalid={!!errors.prixTTC}
                      placeholder="1500.00"
                    />
                    <InputGroup.Text>€</InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.prixTTC?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Pourcentage arrhes</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      {...register('pourcentageArrhes')}
                      placeholder="30"
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Montant arrhes (€)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      step="0.01"
                      {...register('montantArrhes')}
                      placeholder="450.00"
                      readOnly
                      className="bg-light"
                    />
                    <InputGroup.Text>€</InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="text-muted small">
                    Calculé automatiquement
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>

          <hr className="my-4" />

          {/* Observations */}
          <div>
            <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
              <FiFileText className="me-2" size={16} />
              Observations
            </h6>
            <Form.Group>
              <Form.Label>Notes particulières</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register('observation')}
                placeholder="Notes particulières, demandes spéciales..."
                maxLength={1000}
              />
            </Form.Group>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-top bg-light">
          <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
            <FiX className="me-1" size={14} />
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Enregistrement...
              </>
            ) : (
              <>
                <FiSave className="me-1" size={14} />
                {devis ? 'Modifier' : 'Créer'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DevisForm;