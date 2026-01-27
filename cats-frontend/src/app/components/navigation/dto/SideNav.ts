import { IconType } from 'react-icons/lib';
import {
  HouseIcon,
  MagnifyingGlassIcon,
  MapLocationIcon,
  ScrewdriverWrenchIcon,
  FolderIcon,
  FileExportIcon,
  BookIcon,
  ShoppingCartIcon,
  ListCheckIcon,
  UserTie,
  AddressBookIcon,
  FileContractIcon,
} from '../../common/icon';
import { UserRoleType } from '../../../helpers/utility';

/**
 * Class representing a sidebar navigation item.
 */
export class SideNav {
  // Static counter to track the next unique ID for each SideNav instance
  private static idCounter = 0;

  // Unique ID for the navigation item
  public id: number;

  /**
   * Create a SideNav instance.
   * @param displayText - The text to display for the navigation item.
   * @param hasChildren - Indicates if the item has child navigation items.
   * @param icon - The icon associated with the navigation item.
   * @param linkTo - The link that the navigation item points to.
   * @param children - An array of child SideNav items (if any).
   * @param lowerSection - A flag indicating if this item belongs to a lower section.
   */
  constructor(
    public displayText: string,
    public hasChildren: boolean,
    public icon: IconType | null,
    public linkTo: string,
    public children: SideNav[] = [],
    public lowerSection: boolean = false,
    public requiredRoles?: UserRoleType[], // New optional property to define allowed roles
  ) {
    // Increment the static counter and assign it to the instance ID
    this.id = ++SideNav.idCounter;
  }
}

// Helper function to create SideNav instances easily with object destructuring
const createSideNav = ({
  displayText,
  hasChildren,
  icon,
  linkTo,
  children = [],
  lowerSection = false,
  requiredRoles, // Optional property for role-based access
}: {
  displayText: string;
  hasChildren: boolean;
  icon: IconType | null;
  linkTo: string;
  children?: SideNav[];
  lowerSection?: boolean;
  requiredRoles?: UserRoleType[]; // Role-based access control
}) =>
  new SideNav(
    displayText,
    hasChildren,
    icon,
    linkTo,
    children,
    lowerSection,
    requiredRoles,
  );

// Consolidated references to icon components for easy access
const icons = {
  dashboard: HouseIcon,
  textSearch: MagnifyingGlassIcon,
  mapLocation: MapLocationIcon,
  tools: ScrewdriverWrenchIcon,
  folios: FolderIcon,
  purchases: FileExportIcon,
  reference: BookIcon,
  cart: ShoppingCartIcon,
  srReference: ListCheckIcon,
  userTie: UserTie,
  AddressBook: AddressBookIcon,
  tasks: FileContractIcon,
};

// Refactored role-based navigation lists using a Record type
const roleBasedSideBarList: Record<string, SideNav[]> = {
  internal: [
    createSideNav({
      displayText: 'Dashboard',
      hasChildren: false,
      icon: icons.dashboard,
      linkTo: '/dashboard',
    }),
    createSideNav({
      displayText: 'Applications',
      hasChildren: true,
      icon: null,
      linkTo: '/',
      children: [
        createSideNav({
          displayText: 'All Applications',
          hasChildren: false,
          icon: icons.folios,
          linkTo: '/applications',
        }),
      ],
    }),
    createSideNav({
      displayText: 'Manage',
      hasChildren: true,
      icon: null,
      linkTo: '/',
      children: [
        createSideNav({
          displayText: 'People',
          hasChildren: false,
          icon: icons.AddressBook,
          linkTo: '/people',
        }),
        createSideNav({
          displayText: 'Staff',
          hasChildren: false,
          icon: icons.userTie,
          linkTo: '/staff',
          requiredRoles: [UserRoleType.MANAGER], // Only 'CSSA Manager' can access
        }),
      ],
    }),
  ],
  public: [],
};

/**
 * Get the sidebar navigation list based on the user's role.
 * @param userRole - The role of the user (client, internal, sr, public).
 * @returns An array of SideNav items for the specified role.
 */
const getSideBarNavList = (userRole: UserRoleType) =>
  roleBasedSideBarList[userRole] || [];

// Exporting the functions and classes for external use
export { getSideBarNavList };
export default SideNav;
