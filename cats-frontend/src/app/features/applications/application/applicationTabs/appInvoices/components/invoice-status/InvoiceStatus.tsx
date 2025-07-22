import React from 'react';
import './InvoiceStatus.css';
import {
  TextFileEarmark,
  CheckIcon,
  SendIcon,
  DollarIcon,
} from '@cats/components/common/icon';
import { StatusType } from '../invoice-enums/statusType';

type InvoiceStatusProps = {
  status: StatusType;
};

const InvoiceStatus: React.FC<InvoiceStatusProps> = ({ status }) => {
  const getIcon = (status: StatusType) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <TextFileEarmark />;
      case 'received':
        return <CheckIcon />;
      case 'sent':
        return <SendIcon />;
      case 'paid':
        return <DollarIcon />;
      default:
        return null;
    }
  };

  return (
    <span className={`status-pill__base status-pill__${status.toLowerCase()}`}>
      {getIcon(status)} {status}
    </span>
  );
};

export default InvoiceStatus;
