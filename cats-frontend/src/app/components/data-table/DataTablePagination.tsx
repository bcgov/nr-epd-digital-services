import { getPageWindow } from './getPageWindow';
import './DataTablePagination.css';

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function DataTablePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: DataTablePaginationProps) {
  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 0);
  const currentPage = totalPages === 0 ? 1 : Math.min(Math.max(page, 1), totalPages);
  const pageWindow = getPageWindow(currentPage, totalPages);

  const canGoPrevious = currentPage > 1 && totalPages > 0;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="data-table-pagination">
      <div className="data-table-pagination__pages" role="navigation" aria-label="Pagination">
        <button
          type="button"
          className="data-table-pagination__button"
          aria-label="First page"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(1)}
        >
          «
        </button>
        <button
          type="button"
          className="data-table-pagination__button"
          aria-label="Previous page"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹
        </button>

        {pageWindow.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="data-table-pagination__ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`data-table-pagination__button${
                item === currentPage
                  ? ' data-table-pagination__button--active'
                  : ''
              }`}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className="data-table-pagination__button"
          aria-label="Next page"
          disabled={!canGoNext}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </button>
        <button
          type="button"
          className="data-table-pagination__button"
          aria-label="Last page"
          disabled={!canGoNext}
          onClick={() => onPageChange(totalPages)}
        >
          »
        </button>
      </div>

      <label className="data-table-pagination__size">
        <span>Results per page</span>
        <select
          className="data-table-pagination__select"
          aria-label="Results per page"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
