import React from "react";
import { render, screen } from "@testing-library/react";
import Intro from "./Intro";

describe("Intro Component", () => {
  test("renders without crashing", () => {
    render(<Intro />);
  });

  test("renders the correct structure", () => {
    render(<Intro />);
    const introElement = screen.getByTestId("intro");
    expect(introElement).toBeInTheDocument();

    const introSections = screen.getAllByTestId("intro-section");
    expect(introSections.length).toBe(3);
  });

  test("renders correct content in each section", () => {
    render(<Intro />);
    expect(screen.getByText("How To Search")).toBeInTheDocument();
    expect(screen.getByText("Help + Support")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  test("applies correct styles", () => {
    render(<Intro />);
    const introElement = screen.getByTestId("intro");
    expect(introElement).toHaveClass("intro");

    const introSections = screen.getAllByTestId("intro-section");
    introSections.forEach((section) => {
      expect(section).toHaveClass("intro-section");
    });
  });
});
