import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { FinancialSummary } from './FinancialSummary';
import { GetFinancialSummaryDocument } from './graphql/FinancialSummary.generated';
import { vi, describe, it, expect } from 'vitest';

const mockSummaryData = {
  getFinancialSummary: {
    message: 'Financial summary fetched successfully',
    httpStatusCode: 200,
    success: true,
    timestamp: '2026-07-31T00:00:00.000Z',
    data: {
      totalHoursWorked: 125.5,
      totalHoursInvoiced: 80,
      totalCostOfServicesInCents: 625000,
      totalAmountInvoicedInCents: 500000,
      totalAmountPaidInCents: 200000,
      outstandingBalanceInCents: 300000,
    },
  },
};

const mocks = [
  {
    request: {
      query: GetFinancialSummaryDocument,
      variables: { applicationId: 1 },
    },
    result: { data: mockSummaryData },
  },
];

const renderWithProviders = (applicationId = '1') => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter
        initialEntries={[`/applications/${applicationId}/invoices`]}
      >
        <Routes>
          <Route
            path="/applications/:id/invoices"
            element={<FinancialSummary />}
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('FinancialSummary', () => {
  it('renders loading state initially', () => {
    renderWithProviders();
    expect(screen.getByText('Financial Summary')).toBeInTheDocument();
  });

  it('renders financial metrics after data loads', async () => {
    renderWithProviders();

    expect(await screen.findByText('125.50')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('$6,250.00')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('$3,000.00')).toBeInTheDocument();
  });

  it('renders column headers', async () => {
    renderWithProviders();

    await screen.findByText('125.50');

    expect(screen.getByText('Hours Worked')).toBeInTheDocument();
    expect(screen.getByText('Hours Invoiced')).toBeInTheDocument();
    expect(screen.getByText('Service Costs')).toBeInTheDocument();
    expect(screen.getByText('Invoice Total')).toBeInTheDocument();
    expect(screen.getByText('Outstanding Balance')).toBeInTheDocument();
  });
});
