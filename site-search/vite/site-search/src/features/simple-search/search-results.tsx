
import { Site } from '@/api/sites'

export default function SimpleSearchResults({ site }: Site) {
    // console.log('SimpleSearchResults site', site)

    return (
        <div>
            <a>View Site Details (TODO)</a>
            <a>View on Map (TODO)</a>
            <span className="float-end fst-italic">Last Updated: {site.lastUpdated.toISOString().split('T')[0]} </span>

            <table className="table bg-light">
                <thead>
                    <tr>
                        <th scope="col">Site ID</th>
                        <th scope="col">Address/City</th>
                        <th scope="col">Latitude</th>
                        <th scope="col">Longitude</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">{site.siteID}</th>
                        <td>{site.address}</td>
                        <td>{site.latitude}</td>
                        <td>{site.longitude}</td>
                    </tr>
                </tbody>
            </table>
            <hr className='mb-5' />
        </div>
    )
}