import { Card, Button, Badge, Row, Col, ButtonGroup } from 'react-bootstrap';
import { 
  FiEdit3, 
  FiTrash2, 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign, 
  FiUser, 
  FiMail, 
  FiMessageSquare, 
  FiCheck, 
  FiX, 
  FiClock,
  FiEye,
  FiFileText
} from 'react-icons/fi';
import { getFormuleLabel, getFormuleColor } from '../../utils/constants';

const DevisCard = ({ devis, onEdit, onDelete, onSend, onUpdateStatus, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Fonction pour obtenir les infos du statut avec icônes Feather
  const getStatusInfo = (statut) => {
    switch (statut) {
      case 'BROUILLON':
        return { text: 'Brouillon', variant: 'warning', icon: FiFileText };
      case 'ENVOYE':
        return { text: 'Envoyé', variant: 'info', icon: FiMail };
      case 'ACCEPTE':
        return { text: 'Accepté', variant: 'success', icon: FiCheck };
      case 'REFUSE':
        return { text: 'Refusé', variant: 'danger', icon: FiX };
      case 'EXPIRE':
        return { text: 'Expiré', variant: 'secondary', icon: FiClock };
      default:
        return { text: statut || 'Inconnu', variant: 'light', icon: FiClock };
    }
  };

  const statusInfo = getStatusInfo(devis.statut);
  const StatusIcon = statusInfo.icon;
  const canBeSent = devis.statut === 'BROUILLON';
  const canBeEdited = devis.statut === 'BROUILLON';
  const canChangeStatus = devis.statut === 'ENVOYE';

  return (
    <Card className="h-100 custom-card shadow-sm">
      <Card.Body className="d-flex flex-column">
        {/* Header avec client, formule et statut */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <FiUser className="text-muted me-2" size={16} />
              <h6 className="mb-0 text-primary">{devis.clientNom}</h6>
            </div>
            <small className="text-muted">{devis.clientEmail}</small>
          </div>
          <div className="d-flex flex-column align-items-end gap-1">
            <Badge bg={getFormuleColor(devis.formule)}>
              {getFormuleLabel(devis.formule)}
            </Badge>
            <Badge bg={statusInfo.variant} className="d-flex align-items-center gap-1">
              <StatusIcon size={12} />
              {statusInfo.text}
            </Badge>
          </div>
        </div>

        {/* Itinéraire */}
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <FiMapPin className="text-success me-2" size={14} />
            <small><strong>Départ:</strong> {devis.villeDepart}</small>
          </div>
          <div className="d-flex align-items-center">
            <FiMapPin className="text-danger me-2" size={14} />
            <small><strong>Arrivée:</strong> {devis.villeArrivee}</small>
          </div>
        </div>

        {/* Dates */}
        <div className="mb-3">
          <div className="d-flex align-items-center">
            <FiCalendar className="text-muted me-2" size={14} />
            <small>
              <strong>Date devis:</strong> {formatDate(devis.dateDevis)}
            </small>
          </div>
          {devis.dateDepart && (
            <div className="d-flex align-items-center mt-1">
              <FiCalendar className="text-primary me-2" size={14} />
              <small>
                <strong>Déménagement:</strong> {formatDate(devis.dateDepart)}
              </small>
            </div>
          )}
          {devis.dateDepartFlexible && (
            <Badge variant="outline-info" className="mt-1">
              Dates flexibles
            </Badge>
          )}
        </div>

        {/* Détails déménagement */}
        <div className="mb-3">
          <Row className="g-2">
            <Col xs={6}>
              <small className="text-muted">Volume:</small>
              <div><strong>{devis.volume} m³</strong></div>
            </Col>
            <Col xs={6}>
              <small className="text-muted">Prix TTC:</small>
              <div className="text-success"><strong>{formatPrice(devis.prixTTC)}</strong></div>
            </Col>
          </Row>
        </div>

        {/* Arrhes si présents */}
        {devis.pourcentageArrhes > 0 && (
          <div className="mb-3">
            <small className="text-muted">
              Arrhes ({devis.pourcentageArrhes}%): {formatPrice(devis.montantArrhes)}
            </small>
          </div>
        )}

        {/* Observation si présente */}
        {devis.observation && (
          <div className="mb-3">
            <small className="text-muted">Note:</small>
            <div className="text-truncate">
              <small>{devis.observation}</small>
            </div>
          </div>
        )}

        {/* Actions selon le statut */}
        <div className="mt-auto">
          {/* Actions pour les devis BROUILLON */}
          {canBeSent && (
            <div className="mb-2">
              <small className="text-muted d-block mb-1">Envoyer le devis :</small>
              <ButtonGroup className="w-100">
                <Button 
                  variant="outline-success" 
                  size="sm" 
                  onClick={() => onSend(devis, 'email')}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FiMail className="me-1" size={14} />
                  Email
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => onSend(devis, 'sms')}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FiMessageSquare className="me-1" size={14} />
                  SMS
                </Button>
              </ButtonGroup>
            </div>
          )}

          {/* Actions pour les devis ENVOYE */}
          {canChangeStatus && (
            <div className="mb-2">
              <small className="text-muted d-block mb-1">Changer le statut :</small>
              <ButtonGroup className="w-100" size="sm">
                <Button 
                  variant="outline-success" 
                  onClick={() => onUpdateStatus(devis.id, 'ACCEPTE')}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FiCheck className="me-1" size={14} />
                  Accepter
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={() => onUpdateStatus(devis.id, 'REFUSE')}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FiX className="me-1" size={14} />
                  Refuser
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => onUpdateStatus(devis.id, 'EXPIRE')}
                  className="d-flex align-items-center justify-content-center"
                >
                  <FiClock className="me-1" size={14} />
                  Expirer
                </Button>
              </ButtonGroup>
            </div>
          )}

          {/* Actions générales */}
          <div className="d-flex gap-2">
            <Button 
              variant="outline-info" 
              size="sm" 
              onClick={() => onViewDetails(devis)}
              className="flex-grow-1"
            >
              <FiEye className="me-1" size={14} />
              Voir détails
            </Button>
            {canBeEdited && (
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => onEdit(devis)}
              >
                <FiEdit3 size={14} />
              </Button>
            )}
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => onDelete(devis)}
            >
              <FiTrash2 size={14} />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
 
export default DevisCard;