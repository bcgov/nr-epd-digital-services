import React from "react";
import { render, screen } from "@testing-library/react";
import SideBar from "./SideBar";
import { BrowserRouter as Router } from "react-router-dom";

describe("SideBar Component", () => {
  test("renders SideBar component correctly", () => {
    render(
      <Router>
        {" "}
        <SideBar />
      </Router>
    );

    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Text Search")).toBeInTheDocument();
  });
});
