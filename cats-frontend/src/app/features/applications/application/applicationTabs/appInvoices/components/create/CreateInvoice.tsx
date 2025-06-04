import React from 'react';
import { Container } from 'react-bootstrap';
import CreateInvoiceForm from './CreateInvoiceForm';

const CreateInvoice: React.FC = () => {
  return (
    <Container className="mt-4">
      <CreateInvoiceForm />
    </Container>
  );
};

export default CreateInvoice;
