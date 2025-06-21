import { TableColumn } from "@cats/components/table/TableColumn";
import { RequestStatus } from "@cats/helpers/requests/status";

/**
 * Interface for the properties of a dashboard widget.
 * This interface defines the structure of the props that can be passed to a dashboard widget component.
 */
export interface DashboardWidgetProps {
  title?: string; // The title of the widget
  buttonText?: string; // The text for the button in the widget
  columns?: TableColumn[]; // The columns to be displayed in the widget's table
  loading?: RequestStatus; // The loading state of the widget, indicating if data is being fetched
  data?: any[]; // The data to be displayed in the widget's table
  allowRowsSelect?: boolean; // Whether rows in the table can be selected
  onButtonClick?: (card?: any) => void; // Callback function to be called when the button in the widget is clicked
}