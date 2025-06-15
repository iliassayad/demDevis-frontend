import { Modal, Button, Alert } from 'react-bootstrap';

const ConfirmModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  onForceConfirm, 
  title, 
  message, 
  showForceOption = false,
  forceMessage = ''
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>{message}</p>
        {showForceOption && (
          <Alert variant="warning">
            <strong>Attention :</strong> {forceMessage}
          </Alert>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Supprimer
        </Button>
        {showForceOption && (
          <Button variant="warning" onClick={onForceConfirm}>
            Forcer la suppression
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;