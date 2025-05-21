import React from 'react';
import './statusPill.css';
import { StatusType } from './statusType';
import {
  TextFileEarmark,
  CheckIcon,
  SendIcon,
  DollarIcon,
} from '@cats/components/common/icon';

type StatusPillProps = {
  status: StatusType;
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
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

export default StatusPill;
