import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PeopleFilterForm from "./PeopleFilterForm";

// Mocking the Form component
jest.mock("../../../components/form/Form", () => {
  return function MockForm(props) {
    return (
      <div>
        {props.formRows.map((row, index) => (
          <div key={index}>
            {row.map((field) => (
              <input
                key={field.graphQLPropertyName}
                data-testid={field.graphQLPropertyName}
                value={props.formData[field.graphQLPropertyName] || ""}
                onChange={(e) =>
                  props.handleInputChange(
                    field.graphQLPropertyName,
                    e.target.value
                  )
                }
                placeholder={field.placeholder}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };
});

describe("PeopleFilterForm", () => {
  const mockOnInputChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();
  const mockCancelSearchFilter = jest.fn();

  const formData = {
    id: "",
    srStatus: "",
    commonName: "",
    siteRiskCode: "",
    addrLine_1: "",
    city: "",
    whoCreated: "",
    latlongReliabilityFlag: "",
    latdeg: "",
    longdeg: "",
    whenCreated: [],
    whenUpdated: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with initial data", () => {
    render(
      <PeopleFilterForm
        formData={formData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        cancelSearchFilter={mockCancelSearchFilter}
      />
    );

    expect(screen.getByTestId("form")).toBeInTheDocument();
    expect(screen.getByTestId("Submit")).toBeInTheDocument();
    expect(screen.getByTestId("Reset Filters")).toBeInTheDocument();
    expect(screen.getByTestId("Cancel")).toBeInTheDocument();
  });

  it("calls onInputChange when an input value changes", () => {
    render(
      <PeopleFilterForm
        formData={formData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        cancelSearchFilter={mockCancelSearchFilter}
      />
    );

    const inputId = screen.getByTestId("id");
    fireEvent.change(inputId, { target: { value: "123" } });

    expect(mockOnInputChange).toHaveBeenCalledWith("id", "123");
  });

  it("calls onSubmit when the form is submitted", () => {
    render(
      <PeopleFilterForm
        formData={formData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        cancelSearchFilter={mockCancelSearchFilter}
      />
    );

    const form = screen.getByTestId("form");
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("calls onReset when reset button is clicked", () => {
    render(
      <PeopleFilterForm
        formData={formData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        cancelSearchFilter={mockCancelSearchFilter}
      />
    );

    const resetButton = screen.getByTestId("Reset Filters");
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  it("calls cancelSearchFilter when cancel button is clicked", () => {
    render(
      <PeopleFilterForm
        formData={formData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        cancelSearchFilter={mockCancelSearchFilter}
      />
    );

    const cancelButton = screen.getByTestId("Cancel");
    fireEvent.click(cancelButton);

    expect(mockCancelSearchFilter).toHaveBeenCalled();
  });
});
