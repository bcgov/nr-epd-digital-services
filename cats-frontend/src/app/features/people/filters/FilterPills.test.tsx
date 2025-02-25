import { Provider } from "react-redux";
import configureStore, { MockStore } from "redux-mock-store";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterPills from "./FilterPills";

// Mocking the XmarkIcon component
vi.mock("../../../components/common/icon", () => ({
  XmarkIcon: () => <div>XmarkIcon</div>,
}));
const mockStore = configureStore([]);
describe("FilterPills", () => {
  const onRemoveFilterMock = vi.fn();
  let store: MockStore;
  const filters = [
    { key: "1", value: "Filter1Value", label: "Filter1" },
    { key: "2", value: "Filter2Value", label: "Filter2" },
  ];

  beforeEach(() => {
    //   jest.clearAllMocks(); // Clear mock call history before each test
    store = mockStore({
      sites: {},
    });
  });

  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <FilterPills filters={filters} onRemoveFilter={onRemoveFilterMock} />
      </Provider>
    );
    expect(screen.getByTestId("filter-pill")).toBeInTheDocument();
  });

  it("displays the correct number of filter pills", () => {
    render(
      <Provider store={store}>
        <FilterPills filters={filters} onRemoveFilter={onRemoveFilterMock} />
      </Provider>
    );
    const filterPills = screen.getAllByText(/Filter/i);
    expect(filterPills.length).toBe(filters.length);
  });

  it("displays the correct label and value for each filter", () => {
    render(
      <Provider store={store}>
        <FilterPills filters={filters} onRemoveFilter={onRemoveFilterMock} />
      </Provider>
    );
    filters.forEach((filter) => {
      expect(
        screen.getByText(`${filter.label} : ${filter.value}`)
      ).toBeInTheDocument();
    });
  });

  it("calls onRemoveFilter when the XmarkIcon is clicked", () => {
    render(
      <Provider store={store}>
        <FilterPills filters={filters} onRemoveFilter={onRemoveFilterMock} />
      </Provider>
    );
    const removeButtons = screen.getAllByText("XmarkIcon");
    fireEvent.click(removeButtons[0]);
    expect(onRemoveFilterMock).toHaveBeenCalledWith(filters[0]);
  });

  it("does not render any filter pills if the filters array is empty", () => {
    render(
      <Provider store={store}>
        <FilterPills filters={[]} onRemoveFilter={onRemoveFilterMock} />
      </Provider>
    );
    expect(screen.queryByTestId("filter-pill")).toBeEmptyDOMElement();
  });
});
