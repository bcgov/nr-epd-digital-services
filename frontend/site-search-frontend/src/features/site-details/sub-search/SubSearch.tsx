import { Dropdown, DropdownButton } from "react-bootstrap";
import styles from './subsearch.module.css';

interface SubSearchProps {
    label: string;
    showResultsDropdown?: boolean
}

export default function SubSearch({ label, showResultsDropdown = false }: SubSearchProps) {
    return (
        <div>

            <div className="row my-4">
                <div className={showResultsDropdown ? "col-8" : "col-10"}>
                    <input type="text" className={"form-control " + styles.searchBar} placeholder={`Search ${label}`} aria-label={`Search ${label}`} />
                </div>
                <div className='col-2'>
                    <DropdownButton variant='outline-secondary' id="dropdown-notation-search-type" title="Sort results by: Date">
                        <Dropdown.Item eventKey='Date'>Date</Dropdown.Item>
                        <Dropdown.Item eventKey='???'>???</Dropdown.Item>
                    </DropdownButton>
                </div>

                {showResultsDropdown && <div className="col-2">
                    <DropdownButton variant='outline-secondary' id="dropdown-notation-result-sort" title="View Results By: All">
                        <Dropdown.Item eventKey='All'>All</Dropdown.Item>
                        <Dropdown.Item eventKey='???'>???</Dropdown.Item>
                    </DropdownButton>
                </div>}
            </div>
        </div>
    )
}