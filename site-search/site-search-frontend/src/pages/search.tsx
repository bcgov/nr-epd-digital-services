import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'
import { useState } from 'react';

import { Link } from "react-router-dom";
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

    function handleSearch(e){
        setSearchQuery(e.target.value)
        updateSearch(e.target.value)
    }

    function updateSearch(query: string){
        // TODO: Debounce
        setIsLoaded(false)
        setTimeout(() => {

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

                // console.log('sites.filter', { searchBySiteID, searchByCity, searchByRegion })
                // If we have any hits, return true, otherwise if array is empty return false, so Array.filter works above
                // Use filter to remove 'false' from array, so it only returns true on a positive id
                return resultCollection.filter(x=>!!x).length
            })
            setSearchResults(results)
            setIsLoaded(true);
        }, 1000)
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
                        <input type="text" className="form-control simple-search" placeholder="Search Site Records..." aria-label="Search Site Records" onChange={handleSearch}/>
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
                                    return <SimpleSearchResults key={site.uuid} site={site} />
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