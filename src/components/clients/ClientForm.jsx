// src/components/clients/ClientForm.jsx - VERSION CORRIGÉE

import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const ClientForm = ({ show, onHide, onSubmit, client = null, loading = false }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [submitError, setSubmitError] = useState('');

  // ✅ CORRECTION 1: Reset quand le modal s'ouvre/ferme ou quand client change
  useEffect(() => {
    if (show) {
      // Modal ouvert
      if (client) {
        // Mode édition : charger les données du client
        reset(client);
      } else {
        // Mode création : formulaire vide
        reset({ nom: '', email: '', telephone: '' });
      }
      // Reset l'erreur
      setSubmitError('');
    }
  }, [show, client, reset]);

  // ✅ CORRECTION 2: Reset quand le modal se ferme
  const handleClose = () => {
    reset({ nom: '', email: '', telephone: '' });
    setSubmitError('');
    onHide();
  };

  const handleFormSubmit = async (data) => {
    try {
      setSubmitError('');
      await onSubmit(data);
      // ✅ CORRECTION 3: Reset après soumission réussie
      reset({ nom: '', email: '', telephone: '' });
      onHide();
    } catch (error) {
      setSubmitError(error.message || 'Une erreur est survenue');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {client ? 'Modifier le client' : 'Nouveau client'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {submitError && (
            <Alert variant="danger" className="mb-3">
              {submitError}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Nom *</Form.Label>
            <Form.Control
              type="text"
              {...register('nom', { 
                required: 'Le nom est obligatoire',
                minLength: { value: 2, message: 'Le nom doit faire au moins 2 caractères' }
              })}
              isInvalid={!!errors.nom}
              placeholder="Nom du client"
            />
            <Form.Control.Feedback type="invalid">
              {errors.nom?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              {...register('email', { 
                required: 'L\'email est obligatoire',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Format d\'email invalide'
                }
              })}
              isInvalid={!!errors.email}
              placeholder="email@exemple.com"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="tel"
              {...register('telephone')}
              placeholder="01 23 45 67 89"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : (client ? 'Modifier' : 'Créer')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ClientForm;