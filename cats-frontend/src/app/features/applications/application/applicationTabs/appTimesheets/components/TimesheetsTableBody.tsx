import { format, isSameDay } from 'date-fns';
import cx from 'classnames';
import { XmarkIcon } from '@cats/components/common/icon';
import styles from '../Timesheets.module.css';
import { StaffRow } from '../types';

interface TimesheetsTableBodyProps {
  staffRows: StaffRow[];
  weekDays: Date[];
  normalizedData: any;
  edits: any;
  onCellChange: (personId: number, dateStr: string, value: string) => void;
  disabled?: boolean;
  applicationId: number;
}

export const TimesheetsTableBody = ({
  staffRows,
  weekDays,
  normalizedData,
  edits,
  onCellChange,
  disabled,
  applicationId,
}: TimesheetsTableBodyProps) => {
  const today = new Date();

  const getProjectInfo = (person: StaffRow) => (
    <>
      <div className="fw-bold">TODO: address</div>
      <span>
        {applicationId} • TODO: type • {person.firstName} {person.lastName}
      </span>
    </>
  );

  return (
    <tbody>
      {staffRows.map((person) => (
        <tr key={person.personId}>
          <td className={styles.projectCell}>{getProjectInfo(person)}</td>
          {weekDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const currentValue = normalizedData[person.personId]?.[dateStr];
            const editedValue = edits[person.personId]?.[dateStr];
            const value =
              editedValue !== undefined
                ? editedValue
                : (currentValue?.hours?.toFixed(2) ?? '');

            return (
              <td
                key={dateStr}
                className={cx({
                  [styles.highlight]: isSameDay(day, today),
                })}
              >
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="\d*\.?\d{0,2}"
                  value={value}
                  disabled={disabled}
                  onChange={(e) =>
                    onCellChange(person.personId, dateStr, e.target.value)
                  }
                  onBlur={(e) => {
                    if (e.target.value) {
                      const num = parseFloat(e.target.value);
                      if (isNaN(num)) return;

                      onCellChange(person.personId, dateStr, num.toFixed(2));
                    }
                  }}
                />
              </td>
            );
          })}
          <td className="text-center align-middle">
            <XmarkIcon /> Remove
          </td>
        </tr>
      ))}
    </tbody>
  );
};
