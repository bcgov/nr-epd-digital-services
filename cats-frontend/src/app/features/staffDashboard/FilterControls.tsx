import { IFilterControls } from "./IFilterControls";
import  "./FilterControls.css";
import { Button } from "../../components/button/Button";
import { FilterIcon } from "../../components/common/icon";
import { Filter } from "../../../generated/types";
const FilterControls: React.FC<IFilterControls> = (
    {
        handleFilterChange,
        filter,
        toggleColumnSelect
    }
) => {
      return (
        <div className="d-flex gap-2 flex-wrap align-items-center justify-content-start ">
          <div className="d-flex p-0 m-0">
            <Button
              variant="tertiary"
              onClick={() => handleFilterChange(Filter.All)}
              className={
                filter === Filter.All
                  ? 'table-controls__button--selected'
                  : ''
              }
            >
              All
            </Button>
          </div>
          <div className="d-flex">
            <Button
              variant="tertiary"
              onClick={() => handleFilterChange(Filter.Unassigned)}
              className={
                filter === Filter.Unassigned
                  ? 'table-controls__button--selected'
                  : ''
              }
            >
              Unassigned
            </Button>
          </div>
          <div className="d-flex">
            <Button
              variant="tertiary"
              onClick={() => handleFilterChange(Filter.Overcapacity)}
              className={
                filter === Filter.Overcapacity
                  ? 'table-controls__button--selected'
                  : ''
              }
            >
              Overcapacity
            </Button>
          </div>
          {/* <div className="d-flex">
            <Button
              variant="tertiary"
              onClick={() => {
                toggleColumnSelect();
              }}
            >
              <span className="d-flex align-items-center gap-2 justify-content-center">
                <FilterIcon />
                <span>Filter</span>
              </span>
            </Button>
          </div> */}
        </div>
      );
};  

export default FilterControls;