
import { Site } from '@/api/sites'
import { Link } from "react-router-dom";


export default function SimpleSearchResults({ site }: Site) {
    // console.log('SimpleSearchResults site', site)

    return (
        <div>
            <h4>{site.address}</h4>
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
                        <th scope="row">{site.siteID}</th>
                        <td>{site.address}</td>
                        <td>{site.region}</td>
                        <td>{site.latitude}</td>
                        <td>{site.longitude}</td>
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