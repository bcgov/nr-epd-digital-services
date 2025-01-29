import { FC } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../../Store";
import { Button } from "../../../components/button/Button";
import { getUser, isUserOfType, UserRoleType } from "../../../helpers/utility";
// import AddToFolio from '../../folios/AddToFolio';
import {
  FileExportIcon,
  PlainTrashIcon,
  ShoppingCartIcon,
  TrashCanIcon,
} from "../../../components/common/icon";
import { downloadCSV } from "../../../helpers/csvExport/csvExport";
import Actions from "../../../components/action/Actions";
import { updatePeople } from "../dto/PeopleSlice";
// import { addCartItem, resetCartItemAddedStatus } from '../../cart/CartSlice';

interface SearchResultsActionsProps {
  selectedRows: any[]; // TODO: type this properly, should be Site
}
export const SearchResultsActions: FC<SearchResultsActionsProps> = ({
  selectedRows,
}) => {
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const handleExport = () => {
    if (selectedRows.length > 0) {
      downloadCSV(selectedRows);
    }
  };

  const handleActiveStatusChange = (event: any) => {
    const loggedInUser = getUser();
    console.log("event", event, selectedRows);
    if (loggedInUser != null) {
      //auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "bceid" } });
    } else {
      const updatePeopleInput = selectedRows.map((row) => {
        return {
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          isTaxExempt: row.isTaxExempt,
          isEnvConsultant: row.isEnvConsultant,
          loginUserName: row.loginUserName,
          addressLine1: row.addressLine1,
          addressLine2: row.addressLine2,
          city: row.city,
          province: row.province,
          country: row.country,
          postalCode: row.postalCode,
          phone: null,
          mobile: null,
          fax: null,
          email: row.email,
          isActive: event === "Active" ? true : false,
        };
      });
      dispatch(updatePeople(updatePeopleInput)).unwrap();
      // const cartItems = selectedRows.map((row) => {
      //   return {
      //     siteId: row.id,
      //     price: 200.11,
      //   };
      // });
      // dispatch(resetCartItemAddedStatus(null));
      // dispatch(addCartItem(cartItems)).unwrap();
    }
  };

  return (
    <div className="search-result-actions">
      <Actions
        label="Set Active Status"
        items={[
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
        ]}
        onItemClick={handleActiveStatusChange}
        toggleButtonVariant="secondary"
        disable={selectedRows.length === 0}
      />

      <Button
        variant="secondary"
        onClick={handleExport}
        disabled={selectedRows.length === 0}
      >
        <PlainTrashIcon />
        Delete Selected
      </Button>
    </div>
  );
};
