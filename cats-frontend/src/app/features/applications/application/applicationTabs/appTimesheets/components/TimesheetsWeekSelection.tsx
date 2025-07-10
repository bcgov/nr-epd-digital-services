import { format } from 'date-fns';
import { OverlayTrigger } from 'react-bootstrap';
import { Calendar } from 'rsuite';

import { Button } from '@cats/components/button/Button';
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
} from '@cats/components/common/icon';
import styles from '../Timesheets.module.css';

interface TimesheetsWeekSelectionProps {
  startDate: Date;
  endDate: Date;
  isCurrentWeek: boolean;
  onWeekChange: (dir: number) => void;
  disabled: boolean;
  onDateSelect: (date: Date) => void;
}

export const TimesheetsWeekSelection = ({
  startDate,
  endDate,
  isCurrentWeek,
  onWeekChange,
  disabled,
  onDateSelect,
}: TimesheetsWeekSelectionProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex gap-4 align-items-center">
        <div>
          <Button
            variant="secondary"
            onClick={() => onWeekChange(-1)}
            aria-label="Previous week"
            disabled={disabled}
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="secondary"
            onClick={() => onWeekChange(1)}
            aria-label="Next week"
            disabled={disabled}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderLeft: 'none',
            }}
          >
            <ArrowRight />
          </Button>
        </div>

        <div className={styles.weekRangeLabel}>
          {isCurrentWeek && <span className="fw-bold">This Week: </span>}
          <span>
            {format(startDate, 'd MMMM')} - {format(endDate, 'd MMMM yyyy')}
          </span>
        </div>
      </div>
      <OverlayTrigger
        trigger="click"
        placement="bottom-start"
        overlay={
          <div className={styles.datePickerPopover}>
            <Calendar compact onSelect={onDateSelect} weekStart={1} />
          </div>
        }
        rootClose
        transition={false}
      >
        <Button variant="secondary">
          <CalendarIcon /> Select Date
        </Button>
      </OverlayTrigger>
    </div>
  );
};
