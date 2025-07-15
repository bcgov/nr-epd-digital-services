import React from 'react';
import { Container } from 'react-bootstrap';
import ViewInvoiceForm from './ViewInvoiceForm';

const ViewInvoice: React.FC = () => {
  return (
    <Container className="mt-4">
      <ViewInvoiceForm />
    </Container>
  );
};

export default ViewInvoice;
