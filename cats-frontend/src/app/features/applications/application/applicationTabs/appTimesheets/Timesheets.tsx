import { useMemo, useState, useRef } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isThisWeek,
  parseISO,
} from 'date-fns';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  useGetTimesheetDaysForAssignedStaffQuery,
  useUpsertTimesheetDaysMutation,
} from './Timesheets.generated';
import { TimesheetsWeekSelection } from './components/TimesheetsWeekSelection';
import { TimesheetsTableBody } from './components/TimesheetsTableBody';
import { TimesheetsTableFooter } from './components/TimesheetsTableFooter';
import { TimesheetsActions } from './components/TimesheetsActions';
import ModalDialog from '@cats/components/modaldialog/ModalDialog';
import { LockIcon } from '@cats/components/common/icon';
import { Button } from '@cats/components/button/Button';
import {
  NormalizedTimesheetData,
  EditsData,
  TimesheetChange,
  StaffRow,
} from './types';
import { useUnsavedChangesWarning } from '@cats/hooks/useUnsavedChangesWarning';
import styles from './Timesheets.module.css';

function getWeekRange(date: Date) {
  const monday = startOfWeek(date, { weekStartsOn: 1 });
  const sunday = endOfWeek(date, { weekStartsOn: 1 });
  return { monday, sunday };
}

function formatHours(value: number | string): number {
  return Number(parseFloat(String(value)).toFixed(2));
}

function getNumericCellValue(
  normalizedData: NormalizedTimesheetData,
  edits: EditsData,
  personId: number,
  dateStr: string,
): number {
  const currentValue = normalizedData[personId]?.[dateStr];
  const editedValue = edits[personId]?.[dateStr];
  return editedValue !== undefined
    ? parseFloat(editedValue.hours ?? '0')
    : (currentValue?.hours ?? 0);
}

// Normalize API data for fast lookup
function normalizeTimesheetData(
  data: StaffRow[] | undefined,
): NormalizedTimesheetData {
  const normalized: NormalizedTimesheetData = {};

  data?.forEach((person: StaffRow) => {
    normalized[person.personId] = {};
    person.timesheetDays.forEach((day) => {
      const date = day.date.slice(0, 10);
      normalized[person.personId][date] = {
        hours: formatHours(day.hours ?? 0),
        comment: day.comment ?? '',
        id: day.id,
      };
    });
  });

  return normalized;
}

// Denormalize data for API submission
function denormalizeTimesheetData(
  normalizedData: NormalizedTimesheetData,
  edits: EditsData,
  applicationId: number,
): TimesheetChange[] {
  const result: TimesheetChange[] = [];

  Object.entries(edits).forEach(([personId, dateEdits]) => {
    Object.entries(dateEdits).forEach(([date, value]) => {
      const currentValue = normalizedData[Number(personId)]?.[date];
      const newHours =
        value.hours !== undefined
          ? formatHours(value.hours)
          : (currentValue?.hours ?? 0);
      const newComment =
        value.comment !== undefined
          ? value.comment
          : (currentValue?.comment ?? '');
      // Only include if the value has changed
      if (
        currentValue?.hours !== newHours ||
        (currentValue?.comment ?? '') !== newComment
      ) {
        result.push({
          applicationId,
          personId: Number(personId),
          date,
          hours: newHours,
          comment: newComment,
          timesheetDayId: currentValue?.id,
        });
      }
    });
  });

  return result;
}

export const Timesheets = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRefetchingRef = useRef(false);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const startDate = searchParams.get('startDate');
    if (!startDate) {
      return new Date();
    }
    return parseISO(startDate);
  });
  const { monday: startDate, sunday: endDate } = useMemo(
    () => getWeekRange(selectedDate),
    [selectedDate],
  );

  const { id = '' } = useParams();
  const applicationId = parseInt(id, 10);

  const startDateStr = format(startDate, 'yyyy-MM-dd');
  const endDateStr = format(endDate, 'yyyy-MM-dd');

  const [edits, setEdits] = useState<EditsData>({});
  const [isOverrideEditing, setIsOverrideEditing] = useState(false);
  const [showReopenConfirmation, setShowReopenConfirmation] = useState(false);

  const hasUnsavedChanges = Object.keys(edits).length > 0;
  useUnsavedChangesWarning({
    hasUnsavedChanges,
    message:
      'You have unsaved timesheet changes. Are you sure you want to leave?',
  });

  const { data, refetch } = useGetTimesheetDaysForAssignedStaffQuery({
    variables: {
      applicationId,
      startDate: startDateStr,
      endDate: endDateStr,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    onCompleted: () => {
      // We want to clear the edits only when refetching the existing data, not when making new queries.
      // This makes sure the changes are not lost when navigation between dates and the entered values don't flicker after mutation
      if (isRefetchingRef.current) {
        setEdits({});
        isRefetchingRef.current = false;
      }
    },
  });

  const [saveTimesheetDays, { loading: saveTimesheetDaysLoading }] =
    useUpsertTimesheetDaysMutation();

  const normalizedData = useMemo(
    () =>
      normalizeTimesheetData(
        data?.getTimesheetDaysForAssignedStaff?.data ?? undefined,
      ),
    [data],
  );

  const staffRows: StaffRow[] =
    (data?.getTimesheetDaysForAssignedStaff?.data as StaffRow[]) || [];
  const isTimesheetLocked = Boolean(
    data?.getTimesheetDaysForAssignedStaff?.isTimesheetLocked,
  );
  const canOverrideTimesheetLock = Boolean(
    data?.getTimesheetDaysForAssignedStaff?.canOverrideTimesheetLock,
  );
  const isReadOnlyLocked = isTimesheetLocked && !isOverrideEditing;

  const weekDays: Date[] = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [startDate]);

  const handleWeekChange = (dir: number) => {
    const newDate = addWeeks(selectedDate, dir);
    handleDateSelect(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSearchParams((params) => {
      const startDate = getWeekRange(date).monday;
      params.set('startDate', format(startDate, 'yyyy-MM-dd'));
      return params;
    });
  };

  const handleCellChange = (
    personId: number,
    dateStr: string,
    value: { hours?: string; comment?: string },
  ) => {
    setEdits((prev) => ({
      ...prev,
      [personId]: {
        ...prev[personId],
        [dateStr]: {
          ...prev[personId]?.[dateStr],
          ...value,
        },
      },
    }));
  };

  const handleSave = async () => {
    const changes = denormalizeTimesheetData(
      normalizedData,
      edits,
      applicationId,
    );
    if (changes.length > 0) {
      await saveTimesheetDays({
        variables: {
          entries: changes,
        },
      });
      setIsOverrideEditing(false);
      isRefetchingRef.current = true;
      refetch();
    }
  };

  const handleCancelOverride = () => {
    setEdits({});
    setIsOverrideEditing(false);
  };

  const totalHoursPerDay: number[] = weekDays.map((d) => {
    let sum = 0;
    staffRows.forEach((person) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const value = getNumericCellValue(
        normalizedData,
        edits,
        person.personId,
        dateStr,
      );
      if (!isNaN(value)) {
        sum += value;
      }
    });
    return formatHours(sum);
  });

  const totalHoursForAllStaff: number = formatHours(
    totalHoursPerDay.reduce((a, b) => a + b, 0),
  );

  const isCurrentWeek = isThisWeek(startDate, { weekStartsOn: 1 });

  return (
    <div>
      {isTimesheetLocked && (
        <div className={styles.lockBanner}>
          <div className={styles.lockBannerMessage}>
            <span className={styles.lockBannerIcon}>
              <LockIcon />
            </span>
            <span>
              Timesheets are locked as this application has reached invoice
              determination (ODM).
            </span>
          </div>
          {canOverrideTimesheetLock && !isOverrideEditing && (
            <Button
              variant="secondary"
              disabled={saveTimesheetDaysLoading}
              onClick={() => setShowReopenConfirmation(true)}
            >
              Re-open Timesheet
            </Button>
          )}
        </div>
      )}
      <TimesheetsWeekSelection
        startDate={startDate}
        endDate={endDate}
        isCurrentWeek={isCurrentWeek}
        onWeekChange={handleWeekChange}
        disabled={saveTimesheetDaysLoading}
        onDateSelect={handleDateSelect}
      />

      <TimesheetsTableBody
        staffRows={staffRows}
        weekDays={weekDays}
        normalizedData={normalizedData}
        edits={edits}
        onCellChange={handleCellChange}
        disabled={saveTimesheetDaysLoading || isReadOnlyLocked}
      />

      <TimesheetsTableFooter totalHoursForAllStaff={totalHoursForAllStaff} />
      <TimesheetsActions
        onSave={handleSave}
        onCancelOverride={handleCancelOverride}
        hasEdits={hasUnsavedChanges}
        disabled={saveTimesheetDaysLoading}
        isOverrideEditing={isOverrideEditing}
      />

      {showReopenConfirmation && (
        <ModalDialog
          headerLabel="Re-open Timesheet"
          saveBtnLabel="Continue"
          cancelBtnLabel="Cancel"
          closeHandler={(confirmed) => {
            setShowReopenConfirmation(false);
            if (confirmed) {
              setIsOverrideEditing(true);
            }
          }}
        >
          <p>
            Re-opening this timesheet will allow further edits and may impact
            invoicing and reporting. Continue?
          </p>
        </ModalDialog>
      )}
    </div>
  );
};
