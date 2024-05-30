import React from "react";
import { render, screen } from "@testing-library/react";
import MobileNavMenu from "./MobileNavMenu";
import { BrowserRouter as Router } from "react-router-dom";

describe("Mobile Menu Component", () => {
  test("renders SideBar component correctly", () => {
    render(
      <Router>
        {" "}
        <MobileNavMenu />
      </Router>
    );

    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Text Search")).toBeInTheDocument();
  });
});
