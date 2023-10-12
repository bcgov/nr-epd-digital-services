import { Site } from "@/api/sites";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubSearch from "./sub-search/SubSearch";
import SiteDetailsTable from "./table/SiteDetailsTable";

export default function ActivityLog() {
    const { siteID } = useParams();
    const siteIDNum = parseInt(siteID);
    const site: Site = useSelector((state: RootState) => state.site.value.find(searchedSite => searchedSite.siteID === siteIDNum));


    return (
        <div>
            <SubSearch label='Activity Log'></SubSearch>

            <SiteDetailsTable
                label='Activity'
                headers={[
                    { label: 'Activity', accessor: 'activity' },
                    { label: 'User', accessor: 'user' },
                    { label: 'Timestamp', accessor: 'timestamp' },
                ]}
                data={site.activityLog}
                showAddRemoveButtons={false}
            />
        </div>
    )
}