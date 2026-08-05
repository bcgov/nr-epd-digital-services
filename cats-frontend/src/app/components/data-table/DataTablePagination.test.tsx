import { fireEvent, render, screen } from '@testing-library/react';
import { DataTablePagination } from './DataTablePagination';

describe('DataTablePagination', () => {
  it('renders numbered pages and navigates with first/prev/next/last', () => {
    const onPageChange = vi.fn();

    render(
      <DataTablePagination
        page={2}
        pageSize={10}
        totalCount={100}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'First page' }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it('disables previous/first on the first page and next/last on the last page', () => {
    const { rerender } = render(
      <DataTablePagination
        page={1}
        pageSize={10}
        totalCount={30}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();

    rerender(
      <DataTablePagination
        page={3}
        pageSize={10}
        totalCount={30}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });

  it('calls onPageSizeChange when the page size changes', () => {
    const onPageSizeChange = vi.fn();

    render(
      <DataTablePagination
        page={1}
        pageSize={10}
        totalCount={100}
        onPageChange={vi.fn()}
        onPageSizeChange={onPageSizeChange}
      />,
    );

    fireEvent.change(screen.getByLabelText('Results per page'), {
      target: { value: '25' },
    });

    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('renders no page numbers when there are zero results', () => {
    render(
      <DataTablePagination
        page={1}
        pageSize={10}
        totalCount={0}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: /Page / })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
});
