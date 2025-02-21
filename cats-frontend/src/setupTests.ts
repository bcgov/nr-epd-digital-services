import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

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
    signinRedirect: vi.fn(),
  }),
  hasAuthParams: vi.fn(),
}));

vi.mock("./useAu");
