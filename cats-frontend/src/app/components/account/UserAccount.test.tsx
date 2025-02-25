import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserAccount from "./UserAccount";
import avatar from "../../images/avatar.png";
import { Provider } from "react-redux";
import configureStore, { MockStore } from "redux-mock-store";
import thunk from "redux-thunk";

vi.mock("react-oidc-context", () => ({
  useAuth: () => ({
    user: {
      profile: {
        given_name: "John",
        family_name: "Doe",
        preferred_username: "johndoe",
      },
      id_token: "mock-id-token",
    },
  }),
}));

const mockStore = configureStore([thunk]);
describe("UserAccount component", () => {
  let store: MockStore;

  beforeEach(() => {
    store = mockStore({
      UserAccount: {},
    });
  });

  it("renders without crashing", () => {
    render(
      <Provider store={store}>
        <UserAccount />
      </Provider>
    );
  });

  it("toggles dropdown arrow on click", () => {
    const { getByLabelText } = render(
      <Provider store={store}>
        <UserAccount />
      </Provider>
    );
    const toggleButton = getByLabelText("Account Menu");
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("shows account menu when dropdown is expanded", () => {
    const { getByLabelText, getByRole } = render(
      <Provider store={store}>
        <UserAccount />
      </Provider>
    );
    const toggleButton = getByLabelText("Account Menu");
    fireEvent.click(toggleButton);
    const accountMenu = getByRole("menu", { name: "Account Menu" });
    expect(accountMenu).toBeInTheDocument();
  });
});
