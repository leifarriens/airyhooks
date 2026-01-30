import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useMeasure } from "./useMeasure.js";

describe("useMeasure", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockCallback: (entries: ResizeObserverEntry[]) => void;

  const mockBoundingRect = {
    bottom: 200,
    height: 100,
    left: 50,
    right: 250,
    top: 100,
    width: 200,
    x: 50,
    y: 100,
  };

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();

    vi.stubGlobal(
      "ResizeObserver",
      class MockResizeObserver {
        disconnect = mockDisconnect;
        observe = mockObserve;
        unobserve = vi.fn();
        constructor(callback: (entries: ResizeObserverEntry[]) => void) {
          mockCallback = callback;
        }
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("should return ref and initial rect with zeros", () => {
    let result: ReturnType<typeof useMeasure> | undefined;

    const Component = () => {
      result = useMeasure();
      return <div ref={result.ref}>Test</div>;
    };

    render(<Component />);

    expect(typeof result?.ref).toBe("function");
    expect(result?.rect).toEqual({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
    });
  });

  it("should observe the element", () => {
    const Component = () => {
      const { ref } = useMeasure();
      return <div ref={ref}>Test</div>;
    };

    render(<Component />);

    expect(mockObserve).toHaveBeenCalled();
  });

  it("should update rect when element is resized", async () => {
    let result: ReturnType<typeof useMeasure> | undefined;

    const Component = () => {
      result = useMeasure();
      return <div ref={result.ref}>Test</div>;
    };

    render(<Component />);

    const mockEntry = {
      target: {
        getBoundingClientRect: () => mockBoundingRect,
      },
    } as unknown as ResizeObserverEntry;

    mockCallback([mockEntry]);

    await waitFor(() => {
      expect(result?.rect).toEqual(mockBoundingRect);
    });
  });

  it("should disconnect on unmount", () => {
    const Component = () => {
      const { ref } = useMeasure();
      return <div ref={ref}>Test</div>;
    };

    const { unmount } = render(<Component />);
    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should handle null ref", () => {
    let result: ReturnType<typeof useMeasure>;

    const Component = ({ show }: { show: boolean }) => {
      result = useMeasure();
      return show ? <div ref={result.ref}>Test</div> : null;
    };

    const { rerender } = render(<Component show={true} />);

    expect(mockObserve).toHaveBeenCalledTimes(1);

    rerender(<Component show={false} />);

    // Observer should be disconnected when element is removed
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should re-observe when element changes", async () => {
    let result: ReturnType<typeof useMeasure>;

    const Component = ({ id }: { id: string }) => {
      result = useMeasure();
      return (
        <div key={id} ref={result.ref}>
          {id}
        </div>
      );
    };

    const { rerender } = render(<Component id="first" />);

    expect(mockObserve).toHaveBeenCalledTimes(1);

    rerender(<Component id="second" />);

    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalledTimes(2);
    });
  });

  it("should fallback to getBoundingClientRect when ResizeObserver is undefined", () => {
    vi.stubGlobal("ResizeObserver", undefined);

    const mockRect = {
      bottom: 100,
      height: 50,
      left: 10,
      right: 110,
      top: 50,
      width: 100,
      x: 10,
      y: 50,
    };

    let result: ReturnType<typeof useMeasure> | undefined;

    const Component = () => {
      result = useMeasure();
      return (
        <div
          ref={(node) => {
            if (node) {
              vi.spyOn(node, "getBoundingClientRect").mockReturnValue(
                mockRect as DOMRect,
              );
            }
            result?.ref(node);
          }}
        >
          Test
        </div>
      );
    };

    render(<Component />);

    // Should have initial rect from getBoundingClientRect fallback
    expect(result?.rect.width).toBe(100);
    expect(result?.rect.height).toBe(50);
  });
});
