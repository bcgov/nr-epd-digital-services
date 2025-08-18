import React, { useState } from 'react';
import Avatar from '../../../../components/avatar/Avatar';
import './staffAssigned.css';
import { ApplicationResultPersonDto } from '../../../../../generated/types';
import { DropdownIcon } from '../../../../components/common/icon';
import { OverlayTrigger } from 'react-bootstrap';

interface StaffAssignedProps {
  staff: Array<ApplicationResultPersonDto>;
}

const StaffAssigned: React.FC<StaffAssignedProps> = ({ staff }) => {
  const extraStaffCount = staff.length > 4 ? staff.length - 4 : 0;

  const popover = (
    <div className="staff-assigned-popup__list">
      {staff.map((person, index) => (
        <div key={index} className="staff-assigned-popup__item">
          <div className="staff-assigned__avatar">
            <Avatar firstName={person.firstName} lastName={person.lastName} />
          </div>
          <span className="staff-assigned-popup__name">
            {person.firstName} {person.lastName}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-start"
      overlay={!!staff.length ? popover : <></>}
      rootClose
      transition={false}
    >
      <button className="staff-assigned" aria-label="Staff assigned">
        {staff.slice(0, 4).map((person, index) => (
          <div key={index} className="staff-assigned__avatar">
            <Avatar firstName={person.firstName} lastName={person.lastName} />
          </div>
        ))}
        {extraStaffCount > 0 && (
          <span className="staff-assigned__extra">+ {extraStaffCount}</span>
        )}
        <div className="staff-assigned__dropdown-arrow">
        { !!staff.length && <DropdownIcon size={20} />}
        </div>
      </button>
    </OverlayTrigger>
  );
};

export default StaffAssigned;
