import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'
import { useState } from 'react';

import { Link } from "react-router-dom";
import { Site } from '@/api/sites'

import ToggleButton from 'react-bootstrap/ToggleButton';
import { useSelector } from 'react-redux';
import SimpleSearchResults from '@/features/simple-search/search-results';


export default function Search() {
    const [searchBySiteID, setSearchBySiteId] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const sites: Site[] = useSelector(state => state.site.value);
    const [searchResults, setSearchResults] = useState<Site[]>([]); //TODO Change to empty array

    function handleSearch(e){
        console.log('handleSearch', e.target.value)
        // TODO: Debounce
        // TODO: setisLoaded(true)
        // TODO: Allow configurable what to search by, e.g. SiteID or City, etc.
        // Do timeout on setIsLoaded(false)

        setIsLoaded(false)
        setTimeout(() => {
            const results = sites.filter(site => String(site.siteID).includes(e.target.value))
            setSearchResults(results)
            setIsLoaded(true);
        }, 500)


    }

    


    return (
        <>
            <Header />
            <main className='container'>
                <h2 className='text-center py-5'>Site Search</h2>
                <div className="row">
                    <div className="col-sm-10">
                        <input type="text" className="form-control" placeholder="Search Site Records..." aria-label="Search Site Records" onChange={handleSearch}/>
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
                            {!isLoaded && <div>Loading...</div>}
                            {isLoaded && searchResults.map(site => {
                                return <SimpleSearchResults key={site.siteID} site={site} />
                            })}
                        </div>


                    </div>
                </div>

            </main>
        </>
    )


}