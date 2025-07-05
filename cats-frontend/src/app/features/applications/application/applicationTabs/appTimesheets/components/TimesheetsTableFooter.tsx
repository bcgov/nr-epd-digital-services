interface TimesheetsTableFooterProps {
  totalHoursForAllStaff: number;
}

export const TimesheetsTableFooter = ({
  totalHoursForAllStaff,
}: TimesheetsTableFooterProps) => {
  return (
    <div className="py-4">
      <span className="fw-bold">Total Hours:</span>{' '}
      {totalHoursForAllStaff.toFixed(2)}
    </div>
  );
};
