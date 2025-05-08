import { Dropdown } from 'react-bootstrap';
import { useSearchApplicationsByIdQuery } from '../Housing.generated';
import { useCombobox } from 'downshift';
import cx from 'classnames';
import styles from './RelatedApplicationsField.module.css';

// Regex to split by commas with any number of spaces before or after
const COMMA_SEPARATOR_REGEX = /\s*,\s*/;

export function RelatedApplicationsField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const lastValue = value.split(COMMA_SEPARATOR_REGEX).pop();

  const { data } = useSearchApplicationsByIdQuery({
    variables: { query: lastValue || '' },
    skip: !lastValue?.trim(),
  });

  const applications = data?.searchApplicationsById.applications || [];

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      onChange(inputValue);
    },
    items: applications,
    inputValue: value,
    itemToString() {
      return value;
    },
    onSelectedItemChange({ selectedItem }) {
      const newValues = [
        ...value.split(COMMA_SEPARATOR_REGEX).slice(0, -1),
        selectedItem?.id,
      ];

      onChange(newValues.join(', '));
    },
  });

  return (
    <div className={styles.searchFieldContainer}>
      <div className="w-72 flex flex-col gap-1 ">
        <label className="form-label custom-label" {...getLabelProps()}>
          Related Application(s)
        </label>
        <div className="flex shadow-sm bg-white gap-0.5">
          <input
            className="form-control custom-input"
            value={value}
            aria-describedby="value-entry-details"
            {...getInputProps()}
          />
        </div>
        <span id="value-entry-details" className={styles.valueEntryDetails}>
          Separate multiple Application IDs using a comma
        </span>
      </div>

      <Dropdown.Menu
        show={isOpen && !!lastValue?.trim() && applications.length > 0}
        className={styles.dropdownMenu}
        {...getMenuProps({}, { suppressRefError: true })}
      >
        {applications.map((application, index) => (
          <div
            key={application.id}
            className={cx(
              styles.dropdownMenuItem,
              highlightedIndex === index && styles.dropdownMenuItemHighlighted,
            )}
            {...getItemProps({ item: application, index })}
          >
            <div className={styles.menuItemRow}>
              <div className={styles.itemData}>
                <label>Application ID</label>
                {application.id}
              </div>
              <div className={styles.itemData}>
                <label>Site ID</label>
                {application.siteId}
              </div>
            </div>

            <div className={styles.menuItemRow}>
              <div className={styles.itemData}>
                <label>Application Type</label>
                {application.applicationType}
              </div>
              <div className={styles.itemData}>
                <label>Address</label>
                {application.siteAddress}
              </div>
            </div>
          </div>
        ))}
      </Dropdown.Menu>
    </div>
  );
}
