import { RequestStatus } from "../../../helpers/requests/status";
import { Application } from "./Application";

export class ApplicationState {
  applications: Application[] = [];
  error: string = "";
  fetchStatus: string = RequestStatus.idle;
  deleteStatus: string = RequestStatus.idle;
  addedStatus: string = RequestStatus.idle;
}
