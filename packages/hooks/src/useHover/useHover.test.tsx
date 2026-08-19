import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

  it("should reset hover state when the target is removed or replaced", () => {
    const Component = ({ id, visible }: { id: string; visible: boolean }) => {
      const [isHovered, ref] = useHover<HTMLDivElement>();
      return (
        <>
          <output data-testid="hover-state">
            {isHovered ? "Hovering" : "Not hovering"}
          </output>
          {visible ? (
            <div data-testid="hover-element" key={id} ref={ref} />
          ) : null}
        </>
      );
    };

    const { rerender } = render(<Component id="first" visible />);
    fireEvent.mouseEnter(screen.getByTestId("hover-element"));
    expect(screen.getByTestId("hover-state").textContent).toBe("Hovering");

    rerender(<Component id="first" visible={false} />);
    expect(screen.getByTestId("hover-state").textContent).toBe("Not hovering");

    rerender(<Component id="second" visible />);
    expect(screen.getByTestId("hover-state").textContent).toBe("Not hovering");
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
