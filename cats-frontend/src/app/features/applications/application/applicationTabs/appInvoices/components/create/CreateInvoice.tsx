import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import CreateInvoiceForm from './CreateInvoiceForm';

const CreateInvoice: React.FC = () => {
  return (
    <Container className="mt-4">
      <CreateInvoiceForm />
    </Container>
  );
};

export default CreateInvoice;
