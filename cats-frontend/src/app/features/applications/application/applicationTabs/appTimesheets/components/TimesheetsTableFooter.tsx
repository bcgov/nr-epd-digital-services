interface TimesheetsTableFooterProps {
  totalForAllStaff: number;
  totalHoursPerDay: number[];
}

export const TimesheetsTableFooter = ({
  totalForAllStaff,
  totalHoursPerDay,
}: TimesheetsTableFooterProps) => {
  return (
    <tfoot>
      <tr>
        <td>
          <span className="fw-bold">Total Hours:</span>{' '}
          {totalForAllStaff.toFixed(2)}
        </td>
        {totalHoursPerDay.map((hours, index) => (
          <td key={index}>{hours.toFixed(2)}</td>
        ))}
      </tr>
    </tfoot>
  );
};
