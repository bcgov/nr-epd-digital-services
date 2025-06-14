import { format, isSameDay } from 'date-fns';
import cx from 'classnames';
import styles from '../Timesheets.module.css';

interface TimesheetsTableHeadProps {
  weekDays: Date[];
}

export const TimesheetsTableHead = ({ weekDays }: TimesheetsTableHeadProps) => {
  const today = new Date();

  return (
    <thead>
      <tr>
        <th className={styles.projectCell}>
          <div className="fw-bold">Project</div>
          <span>Application ID • Application Type • Staff</span>
        </th>
        {weekDays.map((day, index) => (
          <th
            key={index}
            className={cx({
              [styles.highlight]: isSameDay(day, today),
            })}
          >
            <div className="fw-bold">{format(day, 'EEEE')}</div>
            <div>{format(day, 'd MMM')}</div>
          </th>
        ))}
        <th>Actions</th>
      </tr>
    </thead>
  );
};
