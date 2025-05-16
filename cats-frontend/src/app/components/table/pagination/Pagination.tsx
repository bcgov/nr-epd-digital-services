import React, { ReactNode } from 'react';
import './Pagination.css';
import { AngleLeft, AngleRight } from '../../common/icon';

interface PaginationProps {
  selectPage?: (pageNumber: number) => void;
  currentPage?: number;
  resultsPerPage?: number;
  totalResults?: number;
  changeResultsPerPage?: (resultsCount: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  selectPage,
  currentPage = 1,
  resultsPerPage = 1,
  totalResults = 1,
  changeResultsPerPage,
}) => {
  // Define breakpoints
  const breakpoints = {
    small: 576,
    medium: 768,
    large: 992,
    extraLarge: 1200,
  };

  // Function to check current viewport size against breakpoints
  function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < breakpoints.small) {
      return 'small';
    } else if (width < breakpoints.medium) {
      return 'medium';
    } else if (width < breakpoints.large) {
      return 'large';
    } else {
      return 'extraLarge';
    }
  }

  // Pages To Display
  let pagesToDisplay = 4;

  if (getCurrentBreakpoint() === 'small') {
    pagesToDisplay = 2;
  }

  const totalPagesRequired = Math.ceil(
    (totalResults ?? 0) / (resultsPerPage ?? 1),
  );

  // More Pages Required
  const morePagesToDisplay = totalPagesRequired > pagesToDisplay;

  let maxPagesToRender = 0;

  if (morePagesToDisplay) {
    maxPagesToRender = currentPage + pagesToDisplay - 1;
  } else {
    maxPagesToRender = totalPagesRequired;
  }

  if (maxPagesToRender > totalPagesRequired) {
    maxPagesToRender = totalPagesRequired;
  }

  const paginationDots = <span className="pagination-dots">...</span>;

  const page = (pageNumber: number) => {
    return (
      <div
        onClick={() => selectPage?.(pageNumber)}
        className={`pagination-page ${
          currentPage === pageNumber ? 'pagination-page-active' : ''
        }`}
      >
        {pageNumber}
      </div>
    );
  };

  const renderDotsAndLastPage = () => {
    let firstPagePosition = currentPage % pagesToDisplay;

    let startPage =
      currentPage - firstPagePosition === 0
        ? 1
        : currentPage - firstPagePosition;

    startPage =
      startPage === totalPagesRequired ? startPage - pagesToDisplay : startPage;

    let lastPage = startPage + pagesToDisplay;

    lastPage = lastPage > totalPagesRequired ? totalPagesRequired : lastPage;

    if (lastPage < totalPagesRequired) {
      return (
        <React.Fragment>
          {paginationDots}
          <div className="pagination-section">{page(totalPagesRequired)}</div>
          <AngleRight
            className="pagination-page"
            onClick={() => selectPage?.(currentPage + 1)}
          />
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  const renderDotsAndFirstPage = () => {
    let firstPagePosition = currentPage % pagesToDisplay;

    let startPage =
      currentPage - firstPagePosition === 0
        ? 1
        : currentPage - firstPagePosition;

    startPage =
      startPage === totalPagesRequired
        ? startPage - pagesToDisplay < 1
          ? 1
          : startPage - pagesToDisplay
        : startPage;

    if (startPage !== 1) {
      return (
        <React.Fragment>
          <AngleLeft
            className="pagination-page"
            onClick={() => selectPage?.(currentPage - 1)}
          />
          <div className="pagination-section">{page(1)}</div>
          {paginationDots}
        </React.Fragment>
      );
    } else {
      return null;
    }
  };

  const pageSelectOptions = (): ReactNode => {
    const pages: JSX.Element[] = [];

    for (let i = 1; i <= totalPagesRequired; i++) {
      pages.push(<option key={i}>{i}</option>);
    }

    return pages;
  };

  const renderPageOptions = () => {
    const pages: JSX.Element[] = [];

    let firstPagePosition = currentPage % pagesToDisplay;

    let startPage =
      currentPage - firstPagePosition === 0
        ? 1
        : currentPage - firstPagePosition;

    startPage =
      startPage === totalPagesRequired
        ? startPage - pagesToDisplay < 1
          ? 1
          : startPage - pagesToDisplay
        : startPage;

    let lastPage = startPage + pagesToDisplay;

    lastPage = lastPage > totalPagesRequired ? totalPagesRequired : lastPage;

    for (let i = startPage; i <= lastPage; i++) {
      pages.push(
        <div key={i} className="pagination-section">
          {page(i)}
        </div>,
      );
    }

    return <React.Fragment>{pages}</React.Fragment>;
  };

  return (
    <div className="pagination-control">
      <div className="pagination-pages">
        {
          <React.Fragment>
            {renderDotsAndFirstPage()}
            {renderPageOptions()}
            {renderDotsAndLastPage()}
          </React.Fragment>
        }
      </div>
      <div className="pagination-result-options">
        <div className="result-options-section">
          <span>Results per page</span>
          <select
            data-testid="results-per-page-select"
            className="reslect-options-select"
            onChange={(e) => {
              changeResultsPerPage?.(parseInt(e.target.value));
            }}
            value={resultsPerPage}
          >
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>

        <div className="result-options-section">
          <span>Jump To</span>
          <select
            data-testid="pagination-control-select"
            className="reslect-options-select"
            value={currentPage}
            onChange={(e) => {
              selectPage?.(parseInt(e.target.value));
            }}
          >
            {pageSelectOptions()}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
