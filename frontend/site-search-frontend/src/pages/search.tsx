import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'
import { useState } from 'react';

import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { Site } from '@/api/sites'

import { useSelector } from 'react-redux';
import SimpleSearchResults from '@/features/simple-search/search-results';
import './search.css';
import SearchToggle from '@/features/simple-search/search-toggle';
import Collapse from 'react-bootstrap/Collapse';



export default function SearchPage() {
    const [searchBySiteID, setSearchBySiteId] = useState(false);
    const [searchByCity, setSearchByCity] = useState(false);
    const [searchByRegion, setSearchByRegion] = useState(false);
    const [searchByAddress, setSearchByAddress] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const sites: Site[] = useSelector(state => state.site.value);
    const [searchResults, setSearchResults] = useState<Site[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    function handleSearch(e){
        setSearchQuery(e.target.value)
        updateSearch(e.target.value)
    }

    let searchTimeout: number;
    function updateSearch(query: string){
        // TODO: Debounce! Also cancel timeouts if a new one comes in.
        setIsLoaded(false)

        // Cancel the previous search if a new one comes in, stops jankiness as you type fast.
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {

            // TODO - Only search on SiteID based on user selections
            // TODO - Re-trigger search when state changed
            const results = sites.filter(site => {
                const nothingSelected = (!searchBySiteID && !searchByCity && !searchByRegion);
                const resultCollection = [];
                if (searchBySiteID || nothingSelected) {
                    resultCollection.push(String(site.siteID).includes(query) )
                }
                if (searchByCity || nothingSelected) {
                    resultCollection.push(String(site.city).includes(query))
                }
                if (searchByRegion || nothingSelected) {
                    resultCollection.push(String(site.region).includes(query))
                }
                if (searchByAddress || nothingSelected) {
                    resultCollection.push(String(site.address).includes(query))
                }

                // And search remaining cols if nothing selected:
                if (nothingSelected) {
                    resultCollection.push(String(site.latitude).includes(query))
                    resultCollection.push(String(site.longitude).includes(query))
                }

                // console.log('sites.filter', { searchBySiteID, searchByCity, searchByRegion })
                // If we have any hits, return true, otherwise if array is empty return false, so Array.filter works above
                // Use filter to remove 'false' from array, so it only returns true on a positive id
                return resultCollection.filter(x=>!!x).length
            })

            // By putting a delay between setting search results and displaying them, we cut down on the jank when searching multi-lines
            // May not be necessary w/ Debouncing
            setSearchResults(results)
            setTimeout(() => { setIsLoaded(true) }, 250)
        }, 1000)
    }

    function onEnter(e){
        if (e.key === "Enter") { 
            navigate('/map', { state: { routerSearchQuery: e.target.value}});
        }
    }


    /**
     * These below functions were an attempt to re-trigger serach after clicking a search option, but they did not work.
     * Lead to weird case where old values were rendered.
     */
    // function updateSearchBySite(val: boolean){
    //     // console.log('updateSearchBySite', val)
    //     setSearchBySiteId(val)
    //     updateSearch(searchQuery)
    //     // setTimeout(() =>{updateSearch(searchQuery)}, 0)
    // }

    // function updateSearchByCity(val: boolean){
    //     setSearchByCity(val);
    //     updateSearch(searchQuery)
    // }

    // function updateSearchByRegion(val: boolean){
    //     setSearchByRegion(val)
    //     updateSearch(searchQuery)
    // }

    


    return (
        <>
            <Header />
            <main className='container'>
                <h2 className='text-center py-5'>Site Search</h2>
                <div className="row">
                    <div className="col-sm-10">
                        <input type="text" className="form-control simple-search" placeholder="Search Site Records..." aria-label="Search Site Records" onChange={handleSearch} onKeyDown={onEnter}/>
                    </div>

                    <div className="col-sm">
                        <Link to='/advanced-search'>
                            <Button variant='outline-secondary'>Advanced Search</Button>
                        </Link>
                    </div>
                </div>

                <div className={!!searchQuery.length ? 'fadeIn' : 'fadeOut'}>
                    <div className='bg-light p-3 mt-5 rounded-4 border search-results'>
                        <div className="d-flex search-result-controls">
                            <div className="">
                                <SearchToggle checked={searchBySiteID} onChange={setSearchBySiteId}>Site ID</SearchToggle>
                                <SearchToggle checked={searchByCity} onChange={setSearchByCity}>City</SearchToggle>
                                <SearchToggle checked={searchByRegion} onChange={setSearchByRegion}>Region</SearchToggle>
                                <SearchToggle checked={searchByAddress} onChange={setSearchByAddress}>Address</SearchToggle>
                                {/* The below were trying to use the commented out functions that re-trigger search on selection. Will pick this up again later. */}
                                {/* <SearchToggle checked={searchBySiteID} onChange={updateSearchBySite}>Site ID</SearchToggle> */}
                                {/* <SearchToggle checked={searchByCity} onChange={updateSearchByCity}>City</SearchToggle> */}
                                {/* <SearchToggle checked={searchByRegion} onChange={updateSearchByRegion}>Region</SearchToggle> */}
                            </div>
                        </div>
                        <div className="row search-results mt-3">

                            <div className="result">
                                {!isLoaded && <div>Loading...</div>}
                                {isLoaded && searchResults.map(site => {
                                    return <SimpleSearchResults key={site.uuid} site={site} highlight={searchQuery} />
                                })}
                                {isLoaded && searchResults.length == 0 && <div>
                                    No results
                                </div>}
                            </div>


                        </div>
                    </div>
                </div>
                

            </main>
        </>
    )


}