import { cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useClickAway } from "./useClickAway.js";

describe("useClickAway", () => {
  afterEach(() => {
    cleanup();
  });

  it("should call callback when clicking outside element", () => {
    const callback = vi.fn();
    const Component = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      useClickAway(ref, callback);

      return (
        <div>
          <div data-testid="target" ref={ref}>
            Target
          </div>
          <div data-testid="outside">Outside</div>
        </div>
      );
    };

    const { getByTestId } = render(<Component />);

    fireEvent.mouseDown(getByTestId("outside"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when clicking inside element", () => {
    const callback = vi.fn();
    const Component = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      useClickAway(ref, callback);

      return (
        <div data-testid="target" ref={ref}>
          Target
        </div>
      );
    };

    const { getByTestId } = render(<Component />);

    fireEvent.mouseDown(getByTestId("target"));
    expect(callback).not.toHaveBeenCalled();
  });

  it("should cleanup listener on unmount", () => {
    const callback = vi.fn();
    const removeSpy = vi.spyOn(document, "removeEventListener");

    const Component = () => {
      const ref = React.useRef<HTMLDivElement>(null);
      useClickAway(ref, callback);
      return <div ref={ref} />;
    };

    const { unmount } = render(<Component />);
    unmount();

    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
  });
});
