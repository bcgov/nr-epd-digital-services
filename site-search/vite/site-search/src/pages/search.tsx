import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'
import { useState } from 'react';

import { Link } from "react-router-dom";

import ToggleButton from 'react-bootstrap/ToggleButton';


export default function Search() {
    const [searchBySiteID, setSearchBySiteId] = useState(false)


    return (
        <>
            <Header />
            <main className='container'>
                <h2 className='text-center py-5'>Site Search</h2>
                <div className="row">
                    <div className="col-sm-10">
                        <input type="text" className="form-control" placeholder="Search Site Records..." aria-label="Search Site Records" />
                    </div>

                    <div className="col-sm">
                        <Link to='/advanced-search'>
                            <Button variant='secondary'>Advanced Search</Button>
                        </Link>
                    </div>
                </div>

                <div className='bg-light p-3 mt-5'>
                    <div className="row search-result-controls">
                        <div className="col">
                            <ToggleButton
                                className="mb-2"
                                id="toggle-check"
                                type="checkbox"
                                variant="outline-primary"
                                checked={searchBySiteID}
                                value="1"
                                onChange={(e) => setSearchBySiteId(e.currentTarget.checked)}
                            >
                                Site ID
                            </ToggleButton>
                        </div>
                    </div>
                    <div className="row search-results mt-5">

                        <div className="result">
                            <div className="result-metadata">
                                <a>View Site Details (TODO)</a>
                                <a>View on Map (TODO)</a>
                                <span className="float-end fst-italic">Last Updated: todotodo</span>

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
                                            <th scope="row">18326</th>
                                            <td>123 Main St, Vancouver</td>
                                            <td>49d 16m 46.8s</td>
                                            <td>123d 4m 29.9s</td>
                                        </tr>
                                    </tbody>
                                </table>


                            </div>
                        </div>


                    </div>
                </div>

            </main>
        </>
    )


}