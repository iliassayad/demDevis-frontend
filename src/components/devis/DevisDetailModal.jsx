import { Modal, Button, Row, Col, Badge, Table } from 'react-bootstrap';
import { 
  FiEdit, 
  FiDownload, 
  FiMail, 
  FiMessageSquare, 
  FiX,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHome,
  FiPackage,
  FiDollarSign,
  FiFileText
} from 'react-icons/fi';
import { getFormuleLabel, getFormuleColor } from '../../utils/constants';

const DevisDetailModal = ({ show, onHide, devis, onEdit }) => {
  if (!devis) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      {/* Header */}
      <Modal.Header className="border-bottom bg-light">
        <Modal.Title className="d-flex align-items-center">
          <FiFileText className="me-2 text-primary" size={20} />
          Détail du Devis #{devis.id.toString().padStart(4, '0')}
        </Modal.Title>
        <Button variant="outline-secondary" onClick={onHide} className="border-0">
          <FiX size={18} />
        </Button>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Informations Client */}
        <div className="mb-4">
          <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
            <FiUser className="me-2" size={16} />
            Informations Client
          </h6>
          <Row>
            <Col md={8}>
              <div className="mb-2">
                <strong className="text-dark">{devis.clientNom}</strong>
              </div>
              <div className="d-flex flex-column gap-1">
                <div className="d-flex align-items-center text-muted small">
                  <FiMail className="me-2" size={14} />
                  {devis.clientEmail}
                </div>
                <div className="d-flex align-items-center text-muted small">
                  <FiPhone className="me-2" size={14} />
                  {devis.clientTelephone || 'Non renseigné'}
                </div>
              </div>
            </Col>
            <Col md={4} className="text-md-end">
              <Badge bg={getFormuleColor(devis.formule)} className="mb-2">
                {getFormuleLabel(devis.formule)}
              </Badge>
              <div className="h4 text-success mb-0">
                {formatPrice(devis.prixTTC)}
              </div>
            </Col>
          </Row>
        </div>

        <hr className="my-4" />

        {/* Détails du Déménagement */}
        <div className="mb-4">
          <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
            <FiMapPin className="me-2" size={16} />
            Déménagement
          </h6>
          <Row>
            <Col md={6}>
              <div className="border rounded p-3 mb-3 mb-md-0">
                <div className="fw-medium text-success mb-2">Départ</div>
                <div className="mb-1"><strong>{devis.villeDepart}</strong></div>
                <div className="text-muted small mb-2">{devis.adresseDepart}</div>
                {devis.habitationDepart && (
                  <div className="d-flex align-items-center text-muted small">
                    <FiHome className="me-1" size={12} />
                    {devis.habitationDepart}
                  </div>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="border rounded p-3">
                <div className="fw-medium text-danger mb-2">Arrivée</div>
                <div className="mb-1"><strong>{devis.villeArrivee}</strong></div>
                <div className="text-muted small mb-2">{devis.adresseArrivee}</div>
                {devis.habitationArrivee && (
                  <div className="d-flex align-items-center text-muted small">
                    <FiHome className="me-1" size={12} />
                    {devis.habitationArrivee}
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <FiPackage className="me-2 text-muted" size={16} />
                <span className="text-muted">Volume:</span>
                <strong className="ms-2">{devis.volume} m³</strong>
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
          <Table size="sm" className="table-borderless">
            <tbody>
              <tr>
                <td className="text-muted small py-1">Date du devis:</td>
                <td className="fw-medium py-1">{formatDate(devis.dateDevis)}</td>
              </tr>
              
              {/* Dates de départ */}
              {devis.dateDepart && !devis.dateDepartFlexible && (
                <tr>
                  <td className="text-muted small py-1">Date de départ:</td>
                  <td className="fw-medium py-1 text-primary">{formatDate(devis.dateDepart)}</td>
                </tr>
              )}
              {devis.dateDepartFlexible && (
                <>
                  <tr>
                    <td className="text-muted small py-1">Départ prévu entre:</td>
                    <td className="fw-medium py-1 text-primary">
                      {formatDate(devis.dateDepartMin)} et {formatDate(devis.dateDepartMax)}
                    </td>
                  </tr>
                </>
              )}
              
              {/* Dates d'arrivée */}
              {devis.dateArrivee && !devis.dateArriveeFlexible && (
                <tr>
                  <td className="text-muted small py-1">Date d'arrivée:</td>
                  <td className="fw-medium py-1 text-success">{formatDate(devis.dateArrivee)}</td>
                </tr>
              )}
              {devis.dateArriveeFlexible && (
                <>
                  <tr>
                    <td className="text-muted small py-1">Arrivée prévue entre:</td>
                    <td className="fw-medium py-1 text-success">
                      {formatDate(devis.dateArriveeMin)} et {formatDate(devis.dateArriveeMax)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
          
          {(devis.dateDepartFlexible || devis.dateArriveeFlexible) && (
            <div className="alert alert-info py-2 mt-2">
              <small>
                <strong>Dates flexibles activées</strong>
                {devis.dateDepartFlexible && <div>• Départ flexible</div>}
                {devis.dateArriveeFlexible && <div>• Arrivée flexible</div>}
              </small>
            </div>
          )}
        </div>

        {/* Observations */}
        {devis.observation && (
          <>
            <hr className="my-4" />
            <div className="mb-4">
              <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
                <FiFileText className="me-2" size={16} />
                Observations
              </h6>
              <div className="bg-light rounded p-3">
                <p className="mb-0">{devis.observation}</p>
              </div>
            </div>
          </>
        )}

        <hr className="my-4" />

        {/* Récapitulatif Financier */}
        <div>
          <h6 className="text-muted text-uppercase small mb-3 d-flex align-items-center">
            <FiDollarSign className="me-2" size={16} />
            Récapitulatif Financier
          </h6>
          <Table className="table-borderless">
            <tbody>
              <tr>
                <td className="text-muted py-2">Prix TTC:</td>
                <td className="text-end py-2">
                  <strong className="h5 text-success mb-0">{formatPrice(devis.prixTTC)}</strong>
                </td>
              </tr>
              {devis.pourcentageArrhes > 0 && (
                <>
                  <tr>
                    <td className="text-muted py-2">Arrhes ({devis.pourcentageArrhes}%):</td>
                    <td className="text-end py-2">
                      <strong>{formatPrice(devis.montantArrhes)}</strong>
                    </td>
                  </tr>
                  <tr className="border-top">
                    <td className="text-muted fw-medium py-3">Solde à payer:</td>
                    <td className="text-end py-3">
                      <strong className="h5 text-success mb-0">
                        {formatPrice(devis.prixTTC - devis.montantArrhes)}
                      </strong>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top bg-light">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex gap-2">
            <Button variant="outline-info" size="sm">
              <FiMessageSquare className="me-1" size={14} />
              SMS
            </Button>
            <Button variant="outline-secondary" size="sm">
              <FiMail className="me-1" size={14} />
              Email
            </Button>
            <Button variant="outline-success" size="sm">
              <FiDownload className="me-1" size={14} />
              PDF
            </Button>
          </div>
          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={onHide}>
              Fermer
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DevisDetailModal;