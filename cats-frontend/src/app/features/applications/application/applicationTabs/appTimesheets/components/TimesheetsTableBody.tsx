import { format, isBefore, isAfter } from 'date-fns';
import cx from 'classnames';
import styles from '../Timesheets.module.css';
import { StaffRow } from '../types';
import CollapsiblePanel from '@cats/components/simple/CollapsiblePanel';
import { useState } from 'react';
import { TimesheetDay } from './TimesheetDay';

interface TimesheetsTableBodyProps {
  staffRows: StaffRow[];
  weekDays: Date[];
  normalizedData: any;
  edits: any;
  onCellChange: (
    personId: number,
    dateStr: string,
    value: { hours?: string; comment?: string },
  ) => void;
  disabled?: boolean;
}

export const TimesheetsTableBody = ({
  staffRows,
  weekDays,
  normalizedData,
  edits,
  onCellChange,
  disabled,
}: TimesheetsTableBodyProps) => {
  const [expandedPersonIds, setExpandedPersonIds] = useState<Set<number>>(
    new Set(),
  );

  // This helps preserve the open/close state of the collapsible panels when navigating between weeks
  const onPersonToggle = (personId: number, open: boolean) => {
    if (open) {
      setExpandedPersonIds((prev) => new Set(prev).add(personId));
    } else {
      setExpandedPersonIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(personId);
        return newSet;
      });
    }
  };

  const totalWeekHours = staffRows.reduce((sum, p) => sum + (p.weekHours ?? 0), 0);
  const totalAllTimeHours = staffRows.reduce((sum, p) => sum + (p.allTimeHours ?? 0), 0);

  return (
    <div>
      <div
        className={cx(
          styles.timesheetBaseHeader,
          styles.timesheetsSectionHeader,
          'fw-bold',
          'd-flex flex-row align-items-center justify-content-between px-3'
        )}
      >
        <span>Assigned Staff</span>
        <span>
          Week Total: <strong>{totalWeekHours.toFixed(2)} h</strong>
          <span> | </span>
          All-Time: <strong>{totalAllTimeHours.toFixed(2)} h</strong>
        </span>
      </div>
      <div>
        {staffRows.map((person) => (
          <CollapsiblePanel
            defaultOpen={expandedPersonIds.has(person.personId)}
            onToggle={(open) => onPersonToggle(person.personId, open)}
            key={`${person.personId}-${person.roleId}`}
            panelContainerClassName={styles.personPanel}
            panelLabelClassName={styles.personPanelLabel}
            label={
              <div className='d-flex w-100 align-items-center justify-content-between'>
                <span>
                  {person.firstName} {person.lastName} | {person.roleDescription}
                </span>
                <span className={styles.personPanelHours}>
                  Week Total: <strong>{(person.weekHours ?? 0).toFixed(2)} h</strong>
                  <span> | </span>
                  All Time: <strong>{(person.allTimeHours ?? 0).toFixed(2)} h</strong>
                </span>
              </div>
            }
            content={
              <div className={styles.timesheetsSectionContent}>
                {weekDays.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const currentValue =
                    normalizedData[person.personId]?.[dateStr] || {};
                  const editedValue = edits[person.personId]?.[dateStr] || {};

                  const dayDisabled =
                    disabled ||
                    (person.startDate && isBefore(day, person.startDate)) ||
                    (person.endDate && isAfter(day, person.endDate));

                  return (
                    <TimesheetDay
                      key={`${person.personId}-${day}`}
                      day={day}
                      personId={person.personId}
                      currentValue={currentValue}
                      editedValue={editedValue}
                      onCellChange={onCellChange}
                      disabled={dayDisabled}
                    />
                  );
                })}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};
