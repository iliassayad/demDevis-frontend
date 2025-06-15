import { Card, Button, Badge } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiPlus } from 'react-icons/fi';

const ClientCard = ({ client, onEdit, onDelete, onCreateDevis }) => {
  return (
    <Card className="h-100 custom-card shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
            <FiUser className="text-primary" size={20} />
          </div>
          <div className="flex-grow-1">
            <Card.Title className="mb-1 fs-5">{client.nom}</Card.Title>
            <Badge bg="success" className="small">
              {client.nombreDevis} devis
            </Badge>
          </div>
        </div>

        <div className="mb-2">
          <div className="d-flex align-items-center mb-1">
            <FiMail className="text-muted me-2" size={14} />
            <small className="text-muted">{client.email}</small>
          </div>
          {client.telephone && (
            <div className="d-flex align-items-center">
              <FiPhone className="text-muted me-2" size={14} />
              <small className="text-muted">{client.telephone}</small>
            </div>
          )}
        </div>

        {client.dateCreation && (
          <small className="text-muted mb-3">
            Créé le {new Date(client.dateCreation).toLocaleDateString('fr-FR')}
          </small>
        )}

        <div className="mt-auto">
          {/* Bouton Créer devis en premier */}
          <div className="mb-2">
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => onCreateDevis(client)}
              className="w-100"
            >
              <FiPlus className="me-1" size={14} />
              Créer un devis
            </Button>
          </div>
          
          {/* Boutons Modifier et Supprimer */}
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => onEdit(client)}
              className="flex-grow-1"
            >
              <FiEdit className="me-1" size={14} />
              Modifier
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => onDelete(client)}
            >
              <FiTrash2 size={14} />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClientCard;