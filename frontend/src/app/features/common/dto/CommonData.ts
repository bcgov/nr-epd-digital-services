import { RequestStatus } from "../../../helpers/requests/status";
import { LookupValues, OrganizationType, Region } from "./LookUpValues";

export class CommonData {
  lookUpValues: LookupValues = { organizationTypes: [], regions: [] };
  error: string = "";
  fetchStatus = RequestStatus.idle;
}
