import { AssociatedFiles } from "../applications/application/applicationTabs/appAssociatedFiles/AssociatedFiles";
import { Details } from "../applications/application/applicationTabs/appDetails/Details";
import { Housing } from "../applications/application/applicationTabs/appHousing/Housing";
import { Invoices } from "../applications/application/applicationTabs/appInvoices/Invoices";
import { Notes } from "../applications/application/applicationTabs/appNotes/Notes";
import { Participants } from "../applications/application/applicationTabs/appParticipants/Participants";
import { Timesheets } from "../applications/application/applicationTabs/appTimesheets/Timesheets";
import { Application } from "../applications/application/applicationTabs/application/Application";


const mainNavComponents = [
  { label: 'Application', value: 'application', component: <Application /> },
  { label: 'Details', value: 'details', component: <Details /> },
  { label: 'Participants', value: 'participants', component: <Participants /> },
  { label: 'Timesheets', value: 'timesheets', component: <Timesheets /> },
  { label: 'Invoices', value: 'invoices', component: <Invoices /> },
  { label: 'Notes', value: 'notes', component: <Notes /> },
  { label: 'Associated Files', value: 'associatedFiles', component: <AssociatedFiles /> },
  { label: 'Housing', value: 'housing', component: <Housing /> },
];

export const getNavComponents = (includeUpdatesTab: boolean) => mainNavComponents;