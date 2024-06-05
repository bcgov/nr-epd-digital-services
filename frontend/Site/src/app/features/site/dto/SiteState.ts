import { ChangeTracker } from "../../../components/common/IChangeType";
import { RequestStatus } from "../../../helpers/requests/status";
import { SiteDetailsMode } from "../../details/dto/SiteDetailsMode";
import { SiteResultDto, Sites } from "./Site"

export class SiteState 
{
    sites: SiteResultDto[] = [];   
    error:string = '';
    fetchStatus:string =  RequestStatus.idle;
    deleteStatus:string =  RequestStatus.idle;
    addedStatus:string =  RequestStatus.idle;   
    updateStatus:string  = RequestStatus.idle;
    searchQuery: string = '';
    pageSize:number = 10;
    currentPage:number = 1;
    resultsCount: number = 0;
    siteDetails?: Sites | null = null;
    siteDetailsFetchStatus:string =  RequestStatus.idle;
    siteDetailsDeleteStatus:string =  RequestStatus.idle;
    siteDetailsAddedStatus:string =  RequestStatus.idle;   
    siteDetailsUpdateStatus:string  = RequestStatus.idle;
    changeTracker: ChangeTracker[] = [];
    siteDetailsMode: SiteDetailsMode = SiteDetailsMode.ViewOnlyMode;
    resetSiteDetails : boolean = false;
}