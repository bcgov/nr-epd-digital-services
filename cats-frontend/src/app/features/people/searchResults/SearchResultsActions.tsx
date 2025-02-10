import { FC } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../../Store";
import { Button } from "../../../components/button/Button";
import { getUser, isUserOfType, UserRoleType } from "../../../helpers/utility";

import {
  FileExportIcon,
  PlainTrashIcon,
  ShoppingCartIcon,
  TrashCanIcon,
} from "../../../components/common/icon";
import { downloadCSV } from "../../../helpers/csvExport/csvExport";
import Actions from "../../../components/action/Actions";
import { updatePeople } from "../dto/PeopleSlice";
interface SearchResultsActionsProps {
  selectedRows: any[];
}
export const SearchResultsActions: FC<SearchResultsActionsProps> = ({
  selectedRows,
}) => {
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const handleExport = () => {
    if (selectedRows.length > 0) {
      const loggedInUser = getUser();
      if (loggedInUser === null) {
        auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "idir" } });
      } else {
        const updatePeopleInput = selectedRows.map((row) => {
          return {
            id: row.id,
            middleName: "",
            firstName: row.firstName,
            lastName: row.lastName,
            isTaxExempt: row.isTaxExempt,
            isEnvConsultant: row.isEnvConsultant,
            loginUserName: row.loginUserName,
            address_1: row.address_1,
            address_2: row.address_2,
            city: row.city,
            prov: row.prov,
            country: row.country,
            postal: row.postal,
            phone: row.phone,
            mobile: row.mobile,
            fax: row.fax,
            email: row.email,
            isActive: false,
            rowVersionCount: 1,
            createdBy: "",
            updatedBy: "",
            createdDatetime: new Date(),
            updatedDatetime: new Date(),
            isDeleted: true,
          };
        });
        dispatch(updatePeople(updatePeopleInput)).unwrap();
      }
    }
  };

  const handleActiveStatusChange = (event: any) => {
    const loggedInUser = getUser();
    console.log("event", event, selectedRows);
    if (loggedInUser === null) {
      auth.signinRedirect({ extraQueryParams: { kc_idp_hint: "idir" } });
    } else {
      const updatePeopleInput = selectedRows.map((row) => {
        return {
          id: row.id,
          middleName: "",
          firstName: row.firstName,
          lastName: row.lastName,
          isTaxExempt: row.isTaxExempt,
          isEnvConsultant: row.isEnvConsultant,
          loginUserName: row.loginUserName,
          address_1: row.address_1,
          address_2: row.address_2,
          city: row.city,
          prov: row.prov,
          country: row.country,
          postal: row.postal,
          phone: row.phone,
          mobile: row.mobile,
          fax: row.fax,
          email: row.email,
          isActive: event === "Active" ? true : false,
          rowVersionCount: 1,
          createdBy: "",
          updatedBy: "",
          createdDatetime: new Date(),
          updatedDatetime: new Date(),
        };
      });
      dispatch(updatePeople(updatePeopleInput)).unwrap();
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
