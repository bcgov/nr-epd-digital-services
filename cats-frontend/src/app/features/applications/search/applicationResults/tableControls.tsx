import React from "react";
import { Filter } from "../searchSlice";
import { TableColumnsIcon } from "../../../../components/common/icon";
import "./tableControls.css";

interface TableControlsProps {
  handleFilterChange: (filter: Filter) => void;
  filter: Filter;
  toggleColumnSelect: () => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  handleFilterChange,
  filter,
  toggleColumnSelect,
}) => {
  return (
    <div className="row">
      <div className="col text-right">
        <div
          onClick={() => handleFilterChange(Filter.All)}
          role="button"
          tabIndex={0}
          className={filter === Filter.All ? "selected" : ""}
        >
          All
        </div>
      </div>
      <div className="col text-right">
        <div
          onClick={() => handleFilterChange(Filter.Assigned)}
          role="button"
          tabIndex={0}
          className={filter === Filter.Assigned ? "selected" : ""}
        >
          Assigned
        </div>
      </div>
      <div className="col text-right">
        <div
          onClick={() => handleFilterChange(Filter.Completed)}
          role="button"
          tabIndex={0}
          className={filter === Filter.Completed ? "selected" : ""}
        >
          Completed
        </div>
      </div>
      <div className="col text-right columns-toggle">
        <div
          onClick={() => {
            toggleColumnSelect();
          }}
          role="button"
          tabIndex={0}
        >
          <span className="inline-flex">
            <TableColumnsIcon />
            <span>Columns</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TableControls;
