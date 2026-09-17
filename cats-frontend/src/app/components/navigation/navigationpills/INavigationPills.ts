import { ReactNode } from 'react';
import { ApplicationNavItem } from '../../../features/navigation/NavigationPillsConfig';

export interface INavigationPills {
  disabled?: boolean;
  items?: ApplicationNavItem[];
  /** Optional actions rendered on the right of the tab row (e.g. Actions dropdown) */
  actions?: ReactNode;
}
