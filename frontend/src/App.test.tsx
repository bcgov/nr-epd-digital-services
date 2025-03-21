import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import { useAuth } from "react-oidc-context";
import { store } from "./app/Store";

vi.mock("react-oidc-context", () => ({
  useAuth: vi.fn().mockReturnValue({ isAuthenticated: true }),
}));

it("renders log in panel", () => {
  //useAuth.mockReturnValue();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const loginPanel = screen.getByText(/Login/i);
  expect(loginPanel).toBeInTheDocument();
});

test("Renders LRS Form Accordion", () => {
  //(useAuth as vi.Mock()).mockReturnValue({ isAuthenticated: true });
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const formAccordion = screen.getByText(/Welcome./i);
  expect(formAccordion).toBeInTheDocument();
});
