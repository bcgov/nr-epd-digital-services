import { GetTimesheetDaysForAssignedStaffQuery } from './Timesheets.generated';

export type StaffRow = NonNullable<
  GetTimesheetDaysForAssignedStaffQuery['getTimesheetDaysForAssignedStaff']['data']
>[number];
export type TimesheetDay = StaffRow['timesheetDays'][number];

export type NormalizedTimesheetData = {
  [personId: number]: {
    [date: string]: {
      hours: number;
      id?: number;
    };
  };
};

export type EditsData = {
  [personId: number]: {
    [date: string]: string;
  };
};

export type TimesheetChange = {
  applicationId: number;
  personId: number;
  date: string;
  hours: number;
  timesheetDayId?: number;
};
