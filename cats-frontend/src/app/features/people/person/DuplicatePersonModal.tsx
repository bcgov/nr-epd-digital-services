import React from 'react';
import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import styles from './DuplicatePersonModal.module.css';

interface DuplicatePersonModalProps {
  duplicatePerson: any;
  onClose: () => void;
}

const DuplicatePersonModal: React.FC<DuplicatePersonModalProps> = ({
  duplicatePerson,
  onClose,
}) => {
  const getPersonName = () => {
    const firstName = duplicatePerson?.firstName || '';
    const middleName = duplicatePerson?.middleName || '';
    const lastName = duplicatePerson?.lastName || '';
    return `${firstName} ${middleName} ${lastName}`.trim().replace(/\s+/g, ' ');
  };

  return (
    <ModalDialog
      headerLabel="Person Already Exists"
      cancelBtnLabel="Close"
      errorOption={true}
      closeHandler={onClose}
    >
      <div className={styles.modalContent}>
        <p className={styles.message}>
          Someone with the name <strong>{getPersonName()}</strong> is already in
          the system.
        </p>
        <p className={styles.instruction}>
          Please review the existing record before proceeding.
        </p>

        <div className={styles.details}>
          <h4>Existing Person Details:</h4>
          <table className={styles.detailTable}>
            <tbody>
              {duplicatePerson?.firstName && (
                <tr>
                  <th>First Name:</th>
                  <td>{duplicatePerson.firstName}</td>
                </tr>
              )}
              {duplicatePerson?.middleName && (
                <tr>
                  <th>Middle Name:</th>
                  <td>{duplicatePerson.middleName}</td>
                </tr>
              )}
              {duplicatePerson?.lastName && (
                <tr>
                  <th>Last Name:</th>
                  <td>{duplicatePerson.lastName}</td>
                </tr>
              )}
              {duplicatePerson?.email && (
                <tr>
                  <th>Email:</th>
                  <td>{duplicatePerson.email}</td>
                </tr>
              )}
              {duplicatePerson?.phone && (
                <tr>
                  <th>Phone:</th>
                  <td>{duplicatePerson.phone}</td>
                </tr>
              )}
              {duplicatePerson?.address_1 && (
                <tr>
                  <th>Address:</th>
                  <td>{duplicatePerson.address_1}</td>
                </tr>
              )}
              {duplicatePerson?.city && (
                <tr>
                  <th>City:</th>
                  <td>{duplicatePerson.city}</td>
                </tr>
              )}
              {duplicatePerson?.loginUserName && (
                <tr>
                  <th>Login Username:</th>
                  <td>{duplicatePerson.loginUserName}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ModalDialog>
  );
};

export default DuplicatePersonModal;
