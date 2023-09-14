import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'
import { useState } from 'react';

import { Link } from "react-router-dom";
import { Site } from '@/api/sites'

import ToggleButton from 'react-bootstrap/ToggleButton';
import { useSelector } from 'react-redux';
import SimpleSearchResults from '@/features/simple-search/search-results';
import './search.css';
import SearchToggle from '@/features/simple-search/search-toggle';


export default function SearchPage() {
    const [searchBySiteID, setSearchBySiteId] = useState(false);
    const [searchByCity, setSearchByCity] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const sites: Site[] = useSelector(state => state.site.value);
    const [searchResults, setSearchResults] = useState<Site[]>([]);

    function handleSearch(e){
        console.log('handleSearch', e.target.value)
        // TODO: Debounce
        setIsLoaded(false)
        setTimeout(() => {

            // TODO - Only search on SiteID based on user selections
            const results = sites.filter(site => {
                // const isAnythingSelected = (!searchBySiteID)
                const resultCollection = [];
                if (searchBySiteID) {
                    resultCollection.push(String(site.siteID).includes(e.target.value) )
                }
                if (searchByCity) {
                    // resultCollection.push(String(site.siteID).includes(e.target.value) )
                }
                // If we have any hits, return true, otherwise if array is empty return false, so Array.filter works above
                return resultCollection.length
            })
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
                    <div className="d-flex search-result-controls">
                        <div className="d-flex">
                            <SearchToggle checked={searchBySiteID} onChange={setSearchBySiteId}>Site ID</SearchToggle>
                            <SearchToggle checked={searchByCity} onChange={setSearchByCity}>City</SearchToggle>
                        </div>
                    </div>
                    <div className="row search-results mt-3">

                        <div className="result">
                            {!isLoaded && <div>Loading...</div>}
                            {isLoaded && searchResults.map(site => {
                                return <SimpleSearchResults key={site.uuid} site={site} />
                            })}
                            {isLoaded && searchResults.length == 0 && <div>
                                No results
                            </div>}
                        </div>


                    </div>
                </div>

            </main>
        </>
    )


}