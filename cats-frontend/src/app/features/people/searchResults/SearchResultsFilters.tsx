import { FC, useState } from "react";
import {
  BarsIcon,
  FilterIcon,
  TableColumnsIcon,
} from "../../../components/common/icon";

import { Dropdown } from "react-bootstrap";
import { Button } from "../../../components/button/Button";
import Column from "../columns/Column";
import type { TableColumn } from "../../../components/table/TableColumn";
import SiteFilterForm from "../filters/PeopleFilterForm";

interface SearchResultsFiltersProps {
  columns: TableColumn[];
  onColumnSelectionChange: (column: TableColumn) => void;
  resetColumns: () => void;
  filtersFormData: { [key: string]: any | [Date, Date] };
  onFiltersChange: (key: string, value: any) => void;
  onFiltersSubmit: (e: React.FormEvent) => void;
  onFiltersReset: () => void;
}

type PanelOption = "filters" | "columns" | null;
export const SearchResultsFilters: FC<SearchResultsFiltersProps> = ({
  columns,
  onColumnSelectionChange,
  resetColumns,
  filtersFormData,
  onFiltersChange,
  onFiltersSubmit,
  onFiltersReset,
}) => {
  const [panelToShow, setPanelToShow] = useState<PanelOption>(null);

  const togglePanel = (panel: PanelOption) => {
    if (panelToShow === panel) {
      setPanelToShow(null);
      return;
    }
    setPanelToShow(panel);
  };

  return (
    <>
      <div className="search-results-section-header-top">
        <div>
          <h2 className="search-results-section-title">People</h2>
        </div>

        <div className="table-actions d-none d-md-flex">
          <div
            className={`table-actions-items ${panelToShow === "columns" ? "active" : ""} `}
            onClick={() => {
              togglePanel("columns");
            }}
          >
            <TableColumnsIcon />
            Columns
          </div>
          <div
            className={`table-actions-items ${panelToShow === "filters" ? "active" : ""}`}
            onClick={() => {
              togglePanel("filters");
            }}
          >
            <FilterIcon />
            Filters
          </div>
        </div>
        <Dropdown className="d-flex d-md-none">
          <Dropdown.Toggle as={Button} variant="tertiary">
            <BarsIcon size={24} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => togglePanel("columns")}
              className="d-flex align-items-center gap-2"
            >
              <TableColumnsIcon />
              <span>Columns</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => togglePanel("filters")}
              className="d-flex align-items-center gap-2"
            >
              <TableColumnsIcon />
              <span>Filters</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {panelToShow === "columns" && (
        <Column
          toggleColumnSelectionForDisplay={onColumnSelectionChange}
          columns={columns}
          reset={resetColumns}
          close={() => togglePanel(null)}
        />
      )}
      {panelToShow === "filters" && (
        <SiteFilterForm
          formData={filtersFormData}
          onInputChange={onFiltersChange}
          onSubmit={onFiltersSubmit}
          onReset={onFiltersReset}
          cancelSearchFilter={() => togglePanel(null)}
        />
      )}
    </>
  );
};
