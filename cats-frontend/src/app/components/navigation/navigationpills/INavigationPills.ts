import { NavComponent } from '../../../features/navigation/NavigationPillsConfig';

export interface INavigationPills {
  disabled?: boolean;
  components: NavComponent[];
  tabSearchKey: string;
}
