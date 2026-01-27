import React from 'react';
import { formRows } from './ApplicationFilterConfig';
import './ApplicationFilterForm.css';
import 'rsuite/DateRangePicker/styles/index.css';
import Form from '../../../../components/form/Form';
import { Button } from '../../../../components/button/Button';

interface ApplicationFilterProps {
  formData: { [key: string]: any | [Date, Date] };
  onInputChange: (key: string, value: any) => void;
  onSubmit: (event: React.FormEvent) => void;
  onReset: () => void;
  cancelSearchFilter: () => void;
}

const ApplicationFilterForm: React.FC<ApplicationFilterProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onReset,
  cancelSearchFilter,
}) => {
  return (
    <>
      <form onSubmit={onSubmit} data-testid="form">
        <Form
          formRows={formRows}
          formData={formData}
          handleInputChange={onInputChange}
        />
        <div className="d-flex flex-wrap justify-content-between w-100 mt-3">
          <div>
            <Button
              variant="secondary"
              onClick={onReset}
              data-testid="Reset Filters"
            >
              Reset Filters
            </Button>
          </div>
          <div className="d-flex gap-2">
            <Button type="submit" data-testid="Submit">
              Submit
            </Button>
            <Button
              variant="tertiary"
              onClick={cancelSearchFilter}
              data-testid="Cancel"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ApplicationFilterForm;
