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
  ) {
    // Increment the static counter and assign it to the instance ID
    this.id = ++SideNav.idCounter;
  }
}

// Helper function to create SideNav instances easily
const createSideNav = (
  displayText: string,
  hasChildren: boolean,
  icon: IconType | null,
  linkTo: string,
  children: SideNav[] = [],
  lowerSection: boolean = false,
) =>
  new SideNav(displayText, hasChildren, icon, linkTo, children, lowerSection);

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
};

// Refactored role-based navigation lists using a Record type
const roleBasedSideBarList: Record<string, SideNav[]> = {
  client: [
    createSideNav('Dashboard', true, icons.dashboard, '/dashboard'),
    createSideNav('Search', true, null, '/', [
      createSideNav('Text Search', false, icons.textSearch, '/search'),
      createSideNav('Map Search', false, icons.mapLocation, '/map'),
    ]),
    createSideNav('Resources', true, null, '/', [
      createSideNav('Tools', false, icons.tools, '/tools'),
      createSideNav('Reference', false, icons.reference, '/review'),
    ]),
    createSideNav('Account', true, null, '/', [
      createSideNav('Folios', false, icons.folios, '/folios'),
      createSideNav('Purchases', false, icons.purchases, '/purchases'),
    ]),
    createSideNav('Cart', false, icons.cart, '/site/cart', [], true),
  ],
  internal: [
    createSideNav('Dashboard', true, icons.dashboard, '/dashboard'),
    createSideNav('Search', true, null, '/', [
      createSideNav('Text Search', false, icons.textSearch, '/search'),
      createSideNav('Map Search', false, icons.mapLocation, '/map'),
    ]),
    createSideNav('Resources', true, null, '/', [
      createSideNav('Tools', false, icons.tools, '/tools'),
      createSideNav('Reference', false, icons.reference, '/ref'),
    ]),
  ],
  sr: [
    createSideNav('Dashboard', true, icons.dashboard, '/dashboard'),
    createSideNav('Search', true, null, '/', [
      createSideNav('Text Search', false, icons.textSearch, '/search'),
      createSideNav('Map Search', false, icons.mapLocation, '/map'),
    ]),
    createSideNav('SR', true, null, '/', [
      createSideNav('Reference', false, icons.srReference, '/review'),
    ]),
  ],
  public: [
    createSideNav('Search', true, null, '/', [
      createSideNav('Text Search', false, icons.textSearch, '/search'),
      createSideNav('Map Search', false, icons.mapLocation, '/map'),
    ]),
    createSideNav('Cart', false, icons.cart, '/site/cart', [], true),
  ],
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