
import { Site } from '@/api/sites'
import { Link } from "react-router-dom";
import Highlighter from '@/components/Highlighted';


export default function SimpleSearchResults({ site, highlight }: Site) {
    // console.log('SimpleSearchResults site', site)

    return (
        <div>
            <h4><Highlighter highlight={highlight}>{site.address}</Highlighter></h4>
            <table className="table bg-light">
                <thead>
                    <tr>
                        <th scope="col">Site ID</th>
                        <th scope="col">City</th>
                        <th scope="col">Region</th>
                        <th scope="col">Latitude</th>
                        <th scope="col">Longitude</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row"><Highlighter highlight={highlight}>{String(site.siteID)}</Highlighter></th>
                        <td><Highlighter highlight={highlight}>{site.city}</Highlighter></td>
                        <td><Highlighter highlight={highlight}>{site.region}</Highlighter></td>
                        <td><Highlighter highlight={highlight}>{String(site.latitude)}</Highlighter></td>
                        <td><Highlighter highlight={highlight}>{String(site.longitude)}</Highlighter></td>
                    </tr>
                </tbody>
            </table>
            <Link className='pr-3 text-decoration-none text-muted' to={`/site/${site.siteID}`}>View Site Details</Link>
            <Link className='px-3 text-decoration-none text-muted' to={`/map?siteID=${site.siteID}`}>View on Map</Link>

            <span className="float-end fst-italic text-muted">Last Updated: {site.lastUpdated.toISOString().split('T')[0]} </span>
            <hr className='mb-5' />
        </div>
    )
}