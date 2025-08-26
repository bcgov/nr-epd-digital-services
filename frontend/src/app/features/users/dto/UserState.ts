import { RequestStatus } from "../../../helpers/requests/status";
import { ExternalUser } from "./ExternalUser";
import { User } from "./User";

export class UserState {
  users: User[] = [];
  isProfileVerified: boolean | null = null;
  error: string = "";
  fetchStatus: string = RequestStatus.idle;
  deleteStatus: string = RequestStatus.idle;
  addedStatus: string = RequestStatus.idle;
  externalUser: ExternalUser | null = null;
  updateStatus: string = RequestStatus.idle;
}
