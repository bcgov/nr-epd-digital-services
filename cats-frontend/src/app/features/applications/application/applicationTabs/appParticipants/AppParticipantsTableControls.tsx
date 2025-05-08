import React from 'react';

import './AppParticipantsTableControls.css';

import {
  AppParticipantFilter,
} from '../../../../../../generated/types';
import { Button } from '../../../../../components/button/Button';

interface TableControlsProps {
  handleFilterChange: (filter: AppParticipantFilter) => void;
  filter: AppParticipantFilter;
}

export const AppParticipantsTableControls: React.FC<TableControlsProps> = ({
  handleFilterChange,
  filter,
}) => {
  return (
    <div className="row">
      <div className="col text-right">
        <Button
          variant="tertiary"
          onClick={() => handleFilterChange(AppParticipantFilter.All)}
          className={
            filter === AppParticipantFilter.All
              ? 'table-controls__button--selected'
              : ''
          }
        >
          All
        </Button>
      </div>
      <div className="col text-right">
        <Button
          variant="tertiary"
          onClick={() => handleFilterChange(AppParticipantFilter.Main)}
          className={
            filter === AppParticipantFilter.Main
              ? 'table-controls__button--selected'
              : ''
          }
        >
          Main
        </Button>
      </div>
    </div>
  );
};
