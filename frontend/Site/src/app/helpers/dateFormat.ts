import { format } from "date-fns";

  
export const formatDateRange = (range: [Date, Date]) => {
    const [startDate, endDate] = range;
    const formattedStartDate = format(startDate, 'dd-MMM-yy');
    const formattedEndDate = format(endDate, 'dd-MMM-yy');
    return `${formattedStartDate} - ${formattedEndDate}`;
};