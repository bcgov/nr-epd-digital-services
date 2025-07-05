import { format, isToday } from 'date-fns';
import cx from 'classnames';
import { ClockIcon, MessageIcon } from '@cats/components/common/icon';
import styles from '../Timesheets.module.css';

interface TimesheetDayProps {
  day: Date;
  personId: number;
  currentValue: any;
  editedValue: any;
  onCellChange: (
    personId: number,
    dateStr: string,
    value: { hours?: string; comment?: string },
  ) => void;
  disabled?: boolean;
}

export const TimesheetDay = ({
  day,
  personId,
  currentValue,
  editedValue,
  onCellChange,
  disabled,
}: TimesheetDayProps) => {
  const dateStr = format(day, 'yyyy-MM-dd');

  const hoursValue =
    editedValue.hours !== undefined
      ? editedValue.hours
      : currentValue.hours !== undefined
        ? currentValue.hours.toFixed(2)
        : '';
  const commentValue =
    editedValue.comment !== undefined
      ? editedValue.comment
      : (currentValue.comment ?? '');

  return (
    <div>
      <div
        className={cx(styles.timesheetsSectionHeader, {
          [styles.highlight]: isToday(day),
        })}
      >
        <div className="fw-bold">{format(day, 'EEEE')}</div>
        <div>{format(day, 'd MMMM')}</div>
      </div>

      <div
        className={cx(styles.timeSheetDayInputs, {
          [styles.highlight]: isToday(day),
        })}
      >
        <div className={styles.inputWithIcon}>
          <input
            type="text"
            inputMode="decimal"
            pattern="\d*\.?\d{0,2}"
            value={hoursValue}
            disabled={disabled}
            className={cx(styles.input, styles.hoursInput)}
            placeholder="Hours"
            onChange={(e) => {
              if (
                e.target.value === '' ||
                /^\d*\.?\d{0,2}$/.test(e.target.value)
              ) {
                onCellChange(personId, dateStr, {
                  hours: e.target.value,
                });
              }
            }}
            onBlur={(e) => {
              if (e.target.value) {
                const num = parseFloat(e.target.value);
                if (isNaN(num)) return;
                onCellChange(personId, dateStr, {
                  hours: num.toFixed(2),
                });
              }
            }}
          />
          <span className={styles.inputIcon}>
            <ClockIcon />
          </span>
        </div>
        <div className={styles.inputWithIcon}>
          <input
            type="text"
            value={commentValue}
            disabled={disabled}
            placeholder="Please add a comment to explain what you worked on during this time."
            className={styles.input}
            onChange={(e) =>
              onCellChange(personId, dateStr, {
                comment: e.target.value,
              })
            }
          />
          <span className={styles.inputIcon}>
            <MessageIcon />
          </span>
        </div>
      </div>
    </div>
  );
};
