import { RequestStatus } from "../../../helpers/requests/status";
import { Site } from "./Site"

export class SiteState 
{
    sites: Site[] = [];   
    error:string = '';
    fetchStatus:string =  RequestStatus.idle;
    deleteStatus:string =  RequestStatus.idle;
    addedStatus:string =  RequestStatus.idle;   
    updateStatus:string  = RequestStatus.idle;
    searchQuery: string = '';
    pageSize:number = 10;
    currentPage:number = 1;
    resultsCount: number = 0;
}