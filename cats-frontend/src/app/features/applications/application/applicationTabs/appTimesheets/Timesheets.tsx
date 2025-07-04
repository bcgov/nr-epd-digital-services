import { useMemo, useState } from 'react';
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
import styles from './Timesheets.module.css';
import { TimesheetsWeekSelection } from './components/TimesheetsWeekSelection';
import { TimesheetsTableHead } from './components/TimesheetsTableHead';
import { TimesheetsTableBody } from './components/TimesheetsTableBody';
import { TimesheetsTableFooter } from './components/TimesheetsTableFooter';
import { TimesheetsActions } from './components/TimesheetsActions';
import {
  NormalizedTimesheetData,
  EditsData,
  TimesheetChange,
  StaffRow,
} from './types';

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
    ? formatHours(editedValue)
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
      const newValue = value ? formatHours(value) : 0;

      // Only include if the value has changed
      if (currentValue?.hours !== newValue) {
        result.push({
          applicationId,
          personId: Number(personId),
          date,
          hours: newValue,
          timesheetDayId: currentValue?.id,
        });
      }
    });
  });

  return result;
}

export const Timesheets = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const { data, refetch } = useGetTimesheetDaysForAssignedStaffQuery({
    variables: {
      applicationId,
      startDate: startDateStr,
      endDate: endDateStr,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setEdits({});
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

  const weekDays: Date[] = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [startDate]);

  const handleWeekChange = (dir: number) => {
    setSelectedDate((prev) => addWeeks(prev, dir));
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
    value: string,
  ) => {
    // Only allow numbers with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setEdits((prev) => ({
        ...prev,
        [personId]: {
          ...prev[personId],
          [dateStr]: value,
        },
      }));
    }
  };

  const handleSave = async () => {
    const changes = denormalizeTimesheetData(
      normalizedData,
      edits,
      applicationId,
    );
    if (changes.length > 0) {
      console.log('Timesheet changes to save:', changes);
      await saveTimesheetDays({
        variables: {
          entries: changes,
        },
      });
      refetch();
    }
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

  const totalForAllStaff: number = formatHours(
    totalHoursPerDay.reduce((a, b) => a + b, 0),
  );

  const isCurrentWeek = isThisWeek(startDate, { weekStartsOn: 1 });

  return (
    <div>
      <TimesheetsWeekSelection
        startDate={startDate}
        endDate={endDate}
        isCurrentWeek={isCurrentWeek}
        onWeekChange={handleWeekChange}
        disabled={saveTimesheetDaysLoading}
        onDateSelect={handleDateSelect}
      />

      <div>
        <table className={`${styles.timesheetsTable}`}>
          <TimesheetsTableHead weekDays={weekDays} />
          <TimesheetsTableBody
            staffRows={staffRows}
            weekDays={weekDays}
            normalizedData={normalizedData}
            edits={edits}
            onCellChange={handleCellChange}
            disabled={saveTimesheetDaysLoading}
            applicationId={applicationId}
          />
          <TimesheetsTableFooter
            totalForAllStaff={totalForAllStaff}
            totalHoursPerDay={totalHoursPerDay}
          />
        </table>
      </div>

      <TimesheetsActions
        onSave={handleSave}
        hasEdits={Object.keys(edits).length > 0}
        disabled={saveTimesheetDaysLoading}
      />
    </div>
  );
};
