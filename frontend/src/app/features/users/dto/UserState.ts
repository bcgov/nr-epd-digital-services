import { RequestStatus } from "../../../helpers/requests/status";
import { User } from "./User"

export class UserState 
{
    users: User[] = []
    error:string = '';
    fetchStatus:string =  RequestStatus.idle;
    deleteStatus:string =  RequestStatus.idle;
    addedStatus:string =  RequestStatus.idle;
}