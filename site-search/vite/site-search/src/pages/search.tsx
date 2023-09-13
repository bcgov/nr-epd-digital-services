import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'
import { useState } from 'react';

import { Link } from "react-router-dom";
import { Site } from '@/api/sites'

import ToggleButton from 'react-bootstrap/ToggleButton';
import { useSelector } from 'react-redux';
import SimpleSearchResults from '@/features/simple-search/search-results';
import './search.css';


export default function SearchPage() {
    const [searchBySiteID, setSearchBySiteId] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const sites: Site[] = useSelector(state => state.site.value);
    const [searchResults, setSearchResults] = useState<Site[]>([]);

    function handleSearch(e){
        console.log('handleSearch', e.target.value)
        // TODO: Debounce
        setIsLoaded(false)
        setTimeout(() => {

            // TODO - Only search on SiteID based on user selections
            const results = sites.filter(site => String(site.siteID).includes(e.target.value))
            setSearchResults(results)
            setIsLoaded(true);
        }, 1000)
    }

    


    return (
        <>
            <Header />
            <main className='container'>
                <h2 className='text-center py-5'>Site Search</h2>
                <div className="row">
                    <div className="col-sm-10">
                        <input type="text" className="form-control simple-search" placeholder="Search Site Records..." aria-label="Search Site Records" onChange={handleSearch}/>
                    </div>

                    <div className="col-sm">
                        <Link to='/advanced-search'>
                            <Button variant='outline-secondary'>Advanced Search</Button>
                        </Link>
                    </div>
                </div>

                <div className='bg-light p-3 mt-5 rounded-4 border'>
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
                    <div className="row search-results mt-3">

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