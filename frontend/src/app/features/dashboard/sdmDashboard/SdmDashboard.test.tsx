import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { useAuth } from "react-oidc-context";
import { store } from "../../../Store";
import Dashboard from "../Dashboard";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-oidc-context", () => ({
  useAuth: vi.fn().mockReturnValue({
    isAuthenticated: true,
    user: {
      profile: {
        realmroles: ["sdm-role"],
      },
    },
  }),
}));

beforeEach(() => {
  Object.defineProperty(window, "location", {
    value: {
      assign: vi.fn(),
    },
  });
});

describe("testing sdm dashboards", () => {
  const env = process.env;
  beforeEach(() => {
    vi.resetModules();
    process.env = { VITE_SDM_ROLE_NAME: "sdm-role", ...env };
  });

  it("Renders SDM Dashboard", () => {
    render(
      //<AuthProvider>
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
      // </AuthProvider>
    );
    const userListLink = screen.getByText(/SDM/i);
    expect(userListLink).toBeInTheDocument();
  });
});
