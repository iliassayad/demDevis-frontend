import { useState } from 'react';
import { Table, Button, ButtonGroup, Badge } from 'react-bootstrap';
import { 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiMail, 
  FiMessageSquare,
  FiFileText,
  FiCheck,
  FiX,
  FiClock
} from 'react-icons/fi';
import DevisDetailModal from './DevisDetailModal';
import { devisService } from '../../services/devisService'; // Import du service API
import toast from 'react-hot-toast';

const DevisTable = ({ devis, onEdit, onDelete, onRefresh, loading }) => {
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sendingStatus, setSendingStatus] = useState({}); // Track envoi en cours

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // NOUVEAU : Fonction pour obtenir le badge de statut
  const getStatusBadge = (statut) => {
    const statusConfig = {
      BROUILLON: { variant: 'secondary', label: 'Brouillon' },
      ENVOYE: { variant: 'warning', label: 'Envoyé' },
      ACCEPTE: { variant: 'success', label: 'Accepté' },
      REFUSE: { variant: 'danger', label: 'Refusé' },
      EXPIRE: { variant: 'dark', label: 'Expiré' }
    };

    const config = statusConfig[statut] || { variant: 'secondary', label: statut };
    return (
      <Badge bg={config.variant} className="small">
        {config.label}
      </Badge>
    );
  };

  // NOUVEAU : Fonction pour obtenir les boutons d'action selon le statut
  const getStatusActions = (item) => {
    switch (item.statut) {
      case 'ENVOYE':
        return (
          <ButtonGroup size="sm">
            <Button
              variant="outline-success"
              onClick={() => handleUpdateStatus(item.id, 'ACCEPTE')}
              title="Accepter"
              className="px-2"
            >
              <FiCheck size={14} />
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => handleUpdateStatus(item.id, 'REFUSE')}
              title="Refuser"
              className="px-2"
            >
              <FiX size={14} />
            </Button>
            <Button
              variant="outline-dark"
              onClick={() => handleUpdateStatus(item.id, 'EXPIRE')}
              title="Marquer expiré"
              className="px-2"
            >
              <FiClock size={14} />
            </Button>
          </ButtonGroup>
        );
      case 'ACCEPTE':
      case 'REFUSE':
      case 'EXPIRE':
        return (
          <Badge bg="secondary" className="small">
            Finalisé
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleViewDetails = (devis) => {
    setSelectedDevis(devis);
    setShowDetailModal(true);
  };

  // NOUVEAU : Fonction pour changer le statut manuellement
  const handleUpdateStatus = async (devisId, newStatus) => {
    try {
      await devisService.updateStatus(devisId, newStatus);
      toast.success(`Devis ${newStatus.toLowerCase()} avec succès !`);
      if (onRefresh) onRefresh(); // Actualiser la liste
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error('Erreur:', error);
    }
  };

  // MODIFIÉ : Fonction pour envoyer par SMS avec appel API
  const handleSendSMS = async (devis) => {
    if (devis.statut !== 'BROUILLON') {
      toast.error('Seuls les devis en brouillon peuvent être envoyés');
      return;
    }

    if (!devis.clientTelephone) {
      toast.error('Aucun numéro de téléphone renseigné pour ce client');
      return;
    }

    setSendingStatus(prev => ({ ...prev, [`sms_${devis.id}`]: true }));

    try {
      await devisService.envoyerParSMS(devis.id, devis.clientTelephone);
      toast.success('Devis envoyé par SMS avec succès !');
      if (onRefresh) onRefresh(); // Actualiser pour voir le changement de statut
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du SMS');
      console.error('Erreur SMS:', error);
    } finally {
      setSendingStatus(prev => ({ ...prev, [`sms_${devis.id}`]: false }));
    }
  };

  // MODIFIÉ : Fonction pour envoyer par Email avec appel API
  const handleSendEmail = async (devis) => {
    if (devis.statut !== 'BROUILLON') {
      toast.error('Seuls les devis en brouillon peuvent être envoyés');
      return;
    }

    setSendingStatus(prev => ({ ...prev, [`email_${devis.id}`]: true }));

    try {
      await devisService.envoyerParEmail(devis.id, devis.clientEmail);
      toast.success('Devis envoyé par email avec succès !');
      if (onRefresh) onRefresh(); // Actualiser pour voir le changement de statut
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email');
      console.error('Erreur Email:', error);
    } finally {
      setSendingStatus(prev => ({ ...prev, [`email_${devis.id}`]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (devis.length === 0) {
    return (
      <div className="text-center py-5">
        <FiFileText size={48} className="text-muted mb-3" />
        <h5 className="text-muted">Aucun devis trouvé</h5>
        <p className="text-muted">Commencez par créer votre premier devis</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <Table hover className="align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Date de Création
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Statut
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Détail
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Client
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Téléphone
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Email
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Devis
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Envoyer
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Statut Action
              </th>
              <th className="border-0 fw-semibold text-muted small text-uppercase px-3 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {devis.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-light bg-opacity-50'}>
                {/* Date de création */}
                <td className="px-3 py-3">
                  <div className="fw-semibold text-dark">
                    {formatDate(item.dateDevis)}
                  </div>
                </td>

                {/* NOUVEAU : Statut */}
                <td className="px-3 py-3">
                  {getStatusBadge(item.statut)}
                </td>

                {/* Détail - Icône oeil */}
                <td className="px-3 py-3">
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => handleViewDetails(item)}
                      title="Voir les détails"
                    >
                      <FiEye size={14} />
                    </Button>
                  </div>
                </td>

                {/* Client (nom) */}
                <td className="px-3 py-3">
                  <div className="fw-semibold text-dark">
                    {item.clientNom}
                  </div>
                </td>

                {/* Téléphone */}
                <td className="px-3 py-3">
                  <span className="text-dark">
                    {item.clientTelephone || '-'}
                  </span>
                </td>

                {/* Email */}
                <td className="px-3 py-3">
                  <span className="text-muted small">
                    {item.clientEmail}
                  </span>
                </td>

                {/* Devis - Icône PDF */}
                <td className="px-3 py-3">
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      title="Télécharger PDF"
                      onClick={() => console.log('Télécharger PDF devis:', item.id)}
                    >
                      <FiFileText size={14} />
                    </Button>
                  </div>
                </td>

                {/* MODIFIÉ : Envoyer - SMS et Email avec conditions */}
                <td className="px-3 py-3">
                  {item.statut === 'BROUILLON' ? (
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-info"
                        onClick={() => handleSendSMS(item)}
                        title="Envoyer SMS"
                        className="px-2"
                        disabled={sendingStatus[`sms_${item.id}`] || !item.clientTelephone}
                      >
                        {sendingStatus[`sms_${item.id}`] ? (
                          <div className="spinner-border spinner-border-sm" />
                        ) : (
                          <FiMessageSquare size={14} />
                        )}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleSendEmail(item)}
                        title="Envoyer Email"
                        className="px-2"
                        disabled={sendingStatus[`email_${item.id}`]}
                      >
                        {sendingStatus[`email_${item.id}`] ? (
                          <div className="spinner-border spinner-border-sm" />
                        ) : (
                          <FiMail size={14} />
                        )}
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <Badge bg="secondary" className="small">
                      Déjà envoyé
                    </Badge>
                  )}
                </td>

                {/* NOUVEAU : Actions de statut */}
                <td className="px-3 py-3">
                  {getStatusActions(item)}
                </td>

                {/* Actions - Modifier et Supprimer */}
                <td className="px-3 py-3">
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-warning"
                      onClick={() => onEdit(item)}
                      title="Modifier"
                      className="px-2"
                      disabled={item.statut !== 'BROUILLON'} // Seuls les brouillons peuvent être modifiés
                    >
                      <FiEdit size={14} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => onDelete(item)}
                      title="Supprimer"
                      className="px-2"
                    >
                      <FiTrash2 size={14} />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal détail */}
      <DevisDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        devis={selectedDevis}
        onEdit={onEdit}
      />
    </>
  );
};

export default DevisTable;