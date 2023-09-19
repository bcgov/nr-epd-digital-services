import Button from 'react-bootstrap/Button';
import Header from '@/components/Header'
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Link,  useNavigate } from "react-router-dom";
import { Site } from '@/api/sites'
import { useSelector } from 'react-redux';
import SimpleSearchResults from '@/features/simple-search/search-results';
import './search.css';
import SearchToggle from '@/features/simple-search/search-toggle';




export default function SearchPage() {
    const [searchBySiteID, setSearchBySiteId] = useState(false);
    const [searchByCity, setSearchByCity] = useState(false);
    const [searchByRegion, setSearchByRegion] = useState(false);
    const [searchByAddress, setSearchByAddress] = useState(false);
    const [searchByRegionalFile, setSearchByRegionalFile] = useState(false);
    const [searchByVictoriaFile, setSearchByVictoriaFile] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);
    const sites: Site[] = useSelector(state => state.site.value);
    const [searchResults, setSearchResults] = useState<Site[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [field, setField] = useState([]);

    const navigate = useNavigate();

    function handleSearch(e) {
        setSearchQuery(e.target.value)
        updateSearch(e.target.value)
    }

    let searchTimeout: number;
    function updateSearch(query: string) {
        // TODO: Debounce! Also cancel timeouts if a new one comes in.
        setIsLoaded(false)

        // Cancel the previous search if a new one comes in, stops jankiness as you type fast.
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {

            // TODO - Only search on SiteID based on user selections
            // TODO - Re-trigger search when state changed
            const results = sites.filter(site => {
                const nothingSelected = (!searchBySiteID && !searchByCity && !searchByRegion && !searchByAddress);
                const resultCollection = [];
                // if (searchBySiteID || nothingSelected) {
                //     resultCollection.push(String(site.siteID).includes(query) )
                // }
                // if (searchByCity || nothingSelected) {
                //     resultCollection.push(String(site.city).includes(query))
                // }
                // if (searchByRegion || nothingSelected) {
                //     resultCollection.push(String(site.region).includes(query))
                // }
                // if (searchByAddress || nothingSelected) {
                //     resultCollection.push(String(site.address).includes(query))
                // }

                if ((searchBySiteID || nothingSelected) && String(site.siteID).includes(query)) {
                    // console.log('Searching Site', {site: site, query, searchBySiteID, nothingSelected})
                    resultCollection.push(true)
                }
                if ((searchByCity || nothingSelected) && String(site.city).includes(query)) {
                    // console.log('Searching city', {siteCity: site.city, query, searchByCity, nothingSelected})
                    resultCollection.push(true)
                }
                if ((searchByRegion || nothingSelected) && String(site.region).includes(query)) {
                    // console.log('Searching Region', {site: site, query, searchByRegion, nothingSelected})
                    resultCollection.push(true)
                }
                if ((searchByAddress || nothingSelected) && String(site.address).includes(query)) {
                    // console.log('Searching Address', {site: site, query, searchByAddress, nothingSelected})
                    resultCollection.push(true)
                }


                // And search remaining cols if nothing selected:
                if (nothingSelected) {
                    resultCollection.push(String(site.latitude).includes(query))
                    resultCollection.push(String(site.longitude).includes(query))
                }

                // console.log('sites.filter', { searchBySiteID, searchByCity, searchByRegion, resultCollection, nothingSelected, site })
                // If we have any hits, return true, otherwise if array is empty return false, so Array.filter works above
                // Use filter to remove 'false' from array, so it only returns true on a positive id
                return resultCollection.filter(x => !!x).length
            })

            // By putting a delay between setting search results and displaying them, we cut down on the jank when searching multi-lines
            // May not be necessary w/ Debouncing
            setSearchResults(results)
            setTimeout(() => { setIsLoaded(true) }, 250)
        }, 2000)
    }

    function onEnter(e) {
        if (e.key === "Enter") {
            navigate('/map', { state: { routerSearchQuery: e.target.value } });
        }
    }


    /**
     * These below functions were an attempt to re-trigger serach after clicking a search option, but they did not work.
     * Lead to weird case where old values were rendered.
     * 
     * FIX: Using useEffect with the dependency array at the end.
     */
    function updateSearchBySite(val: boolean) {
        // console.log('updateSearchBySite', val)
        setSearchBySiteId(val)
        // updateSearch(searchQuery)
    }

    function updateSearchByCity(val: boolean) {
        // setSearchByCity(val);
        setSearchByCity(val);
    }

    function updateSearchByRegion(val: boolean) {
        setSearchByRegion(val)
    }

    function updateSearchByAddress(val: boolean) {
        setSearchByAddress(val)
    }

    // function updateSearchByRegionalFile(val: boolean) {

    // }

    useEffect(() => {
        updateSearch(searchQuery)
    }, [searchByAddress, searchByCity, searchByRegion, searchBySiteID])




    return (
        <>
            <Header />
            <main className='container'>
                <h2 className='text-center py-5'>Site Search</h2>
                <div className="row">
                    <div className="col-sm-10">
                        <input type="text" className="form-control simple-search" placeholder="Search Site Records..." aria-label="Search Site Records" onChange={handleSearch} onKeyDown={onEnter} />
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
                                {/* <SearchToggle checked={searchBySiteID} onChange={setSearchBySiteId}>Site ID</SearchToggle> */}
                                {/* <SearchToggle checked={searchByCity} onChange={setSearchByCity}>City</SearchToggle> */}
                                {/* <SearchToggle checked={searchByRegion} onChange={setSearchByRegion}>Region</SearchToggle> */}
                                {/* <SearchToggle checked={searchByAddress} onChange={setSearchByAddress}>Address</SearchToggle> */}
                                {/* The below were trying to use the commented out functions that re-trigger search on selection. Will pick this up again later. */}
                                <SearchToggle checked={searchBySiteID} onChange={updateSearchBySite}>Site ID</SearchToggle>
                                <SearchToggle checked={searchByCity} onChange={updateSearchByCity}>City</SearchToggle>
                                <SearchToggle checked={searchByRegion} onChange={updateSearchByRegion}>Region</SearchToggle>
                                <SearchToggle checked={searchByAddress} onChange={updateSearchByAddress}>Address</SearchToggle>

                                <SearchToggle checked={searchByRegionalFile} onChange={setSearchByRegionalFile}>Regional File</SearchToggle>
                                <SearchToggle checked={searchByVictoriaFile} onChange={setSearchByVictoriaFile}>Victoria File</SearchToggle>

                            </div>
                        </div>
                        <div className="row search-results mt-3">

                            <div className="result">
                                {!isLoaded && <div>
                                    <Spinner animation="border" role="status" variant='secondary'>
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>}

                                {isLoaded && searchResults.map(site => {
                                    // return <SimpleSearchResults key={site.uuid} site={site} highlight={searchQuery} />
                                    return <SimpleSearchResults key={site.uuid}
                                        site={site}
                                        highlight={searchQuery} 
                                        searchOption={{ searchBySiteID, searchByCity, searchByRegion, searchByAddress }} 
                                        />
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