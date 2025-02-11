import { Participants } from "../applications/application/details/participants/Participants";
import { Timesheets } from "../applications/application/details/timesheets/Timesheets";

const mainNavComponents = [
  { label: 'Participants', value: 'participants', component: <Participants /> },
  { label: 'Timesheets', value: 'timesheets', component: <Timesheets /> },
];

export const getNavComponents = (includeUpdatesTab: boolean) => mainNavComponents;