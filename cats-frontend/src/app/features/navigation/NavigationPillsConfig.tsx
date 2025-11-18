import { ReactNode } from 'react';

export type NavComponent = {
  label: string;
  value: string;
  path: string;
  component: ReactNode;
};

// Navigation configuration for the pills - used by NavigationPills component
export const navigationItems: Omit<NavComponent, 'component'>[] = [
  { label: 'Details', value: 'details', path: 'details' },
  { label: 'Application', value: 'application', path: 'application' },
  { label: 'Participants', value: 'participants', path: 'participants' },
  { label: 'Timesheets', value: 'timesheets', path: 'timesheets' },
  { label: 'Invoices', value: 'invoices', path: 'invoices' },
  { label: 'Notes', value: 'notes', path: 'notes' },
  {
    label: 'Associated Files',
    value: 'associatedFiles',
    path: 'associated-files',
  },
  { label: 'Housing', value: 'housing', path: 'housing' },
];
