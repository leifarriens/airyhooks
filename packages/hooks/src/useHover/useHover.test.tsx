import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import { useHover } from "./useHover.js";

function TestComponent() {
  const [isHovered, ref] = useHover<HTMLDivElement>();

  return (
    <div data-testid="hover-element" ref={ref}>
      {isHovered ? "Hovering" : "Not hovering"}
    </div>
  );
}

describe("useHover", () => {
  afterEach(() => {
    cleanup();
  });

  it("should initialize with false", () => {
    render(<TestComponent />);
    const element = screen.getByTestId("hover-element");
    expect(element.textContent).toBe("Not hovering");
  });

  it("should set to true on mouseenter", () => {
    render(<TestComponent />);
    const element = screen.getByTestId("hover-element");

    fireEvent.mouseEnter(element);
    expect(element.textContent).toBe("Hovering");
  });

  it("should set to false on mouseleave", () => {
    render(<TestComponent />);
    const element = screen.getByTestId("hover-element");

    fireEvent.mouseEnter(element);
    expect(element.textContent).toBe("Hovering");

    fireEvent.mouseLeave(element);
    expect(element.textContent).toBe("Not hovering");
  });

  it("should handle multiple enter/leave cycles", () => {
    render(<TestComponent />);
    const element = screen.getByTestId("hover-element");

    fireEvent.mouseEnter(element);
    expect(element.textContent).toBe("Hovering");

    fireEvent.mouseLeave(element);
    expect(element.textContent).toBe("Not hovering");

    fireEvent.mouseEnter(element);
    expect(element.textContent).toBe("Hovering");
  });
});
