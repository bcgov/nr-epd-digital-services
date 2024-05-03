import React from 'react';
import { render, fireEvent,screen } from '@testing-library/react';
import Pagination from './Pagination';
import { text } from 'stream/consumers';

describe('Pagination Component', () => {
  const selectPageMock = jest.fn(()=>{});
  const changeResultsPerPageMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders pagination correctly with multiple pages', () => {
    const { getByText } = render(
      <Pagination
        selectPage={selectPageMock}
        currentPage={1}
        resultsPerPage={10}
        totalResults={1000}
        changeResultsPerPage={changeResultsPerPageMock}
      />
    );

    expect(screen.getByText('1', { selector: '.pagination-page-active' })).toBeInTheDocument();
    expect(screen.getByText('100', { selector: '.pagination-page' })).toBeInTheDocument();
    // Add more assertions based on your component's logic
  });

  test('calls selectPage when clicking on a page number', () => {
    const { getByText } = render(
      <Pagination
        selectPage={selectPageMock}
        currentPage={1}
        resultsPerPage={10}
        totalResults={100}
        changeResultsPerPage={changeResultsPerPageMock}
      />
    );

    expect(screen.getByText('1', { selector: '.pagination-page-active' })).toBeInTheDocument();
    fireEvent.click(screen.getByText('2', { selector: '.pagination-page' }));
    expect(selectPageMock).toHaveBeenCalledWith(2);
  });

  test('calls changeResultsPerPage when selecting a new results per page option', () => {
    const { getByLabelText } = render(
      <Pagination
        selectPage={selectPageMock}
        currentPage={1}
        resultsPerPage={10}
        totalResults={100}
        changeResultsPerPage={changeResultsPerPageMock}
      />
    );

    fireEvent.change(screen.getByText('Results per page'), { target: { text: '25' } });
    //expect(changeResultsPerPageMock).tobe
  });

  // Add more tests for different scenarios and edge cases
});
