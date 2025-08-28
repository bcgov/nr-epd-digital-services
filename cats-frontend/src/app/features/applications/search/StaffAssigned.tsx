import React from 'react';
import Avatar from '../../../components/avatar/Avatar';
import { ApplicationResultPersonDto } from '../../../../generated/types';
import { DropdownIcon } from '../../../components/common/icon';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import './StaffAssigned.css';

interface StaffAssignedProps {
  staff: ApplicationResultPersonDto[];
}

const StaffAssigned: React.FC<StaffAssignedProps> = ({ staff }) => {
  const visibleStaff = staff.slice(0, 4);
  const extraStaffCount = staff.length - visibleStaff.length;

  const popover = (
    <Popover id="staff-popover" className="staff-assigned-popup">
      <div className="staff-assigned-popup__list">
        {staff.map((person, index) => (
          <div
            key={`${person.firstName}-${person.lastName}-${index}`}
            className="staff-assigned-popup__item"
          >
            <div className="staff-assigned__avatar">
              <Avatar firstName={person.firstName} lastName={person.lastName} />
            </div>
            <span className="staff-assigned-popup__name">
              {person.firstName} {person.lastName}
            </span>
          </div>
        ))}
      </div>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom-start"
      overlay={staff.length > 0 ? popover : <></>}
      rootClose
      transition={false}
    >
      <button className="staff-assigned" aria-label="Staff assigned">
        {visibleStaff.map((person, index) => (
          <div
            key={`${person.firstName}-${person.lastName}-${index}`}
            className="staff-assigned__avatar"
          >
            <Avatar firstName={person.firstName} lastName={person.lastName} />
          </div>
        ))}
        {extraStaffCount > 0 && (
          <span className="staff-assigned__extra">+ {extraStaffCount}</span>
        )}
        {staff.length > 0 && (
          <div className="staff-assigned__dropdown-arrow">
            <DropdownIcon size={20} />
          </div>
        )}
      </button>
    </OverlayTrigger>
  );
};

export default StaffAssigned;
