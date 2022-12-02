import { RequestStatus } from "../../../helpers/requests/status";
import { Profile } from "./Profile";

export class ProfileState{
    profile: Profile = {
        organizations: [],
        regions: []
    }
    error:string = "";
    fetchStatus = RequestStatus.idle
}