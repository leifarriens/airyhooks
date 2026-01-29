import { cleanup, render, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useIntersectionObserver } from "./useIntersectionObserver.js";

describe("useIntersectionObserver", () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let mockCallback: (entries: IntersectionObserverEntry[]) => void;
  let mockConstructorOptions: IntersectionObserverInit | undefined;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    mockConstructorOptions = undefined;

    vi.stubGlobal(
      "IntersectionObserver",
      class MockIntersectionObserver {
        disconnect = mockDisconnect;
        observe = mockObserve;
        unobserve = vi.fn();
        constructor(
          callback: (entries: IntersectionObserverEntry[]) => void,
          options?: IntersectionObserverInit,
        ) {
          mockCallback = callback;
          mockConstructorOptions = options;
        }
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("should return ref, entry, and isIntersecting", () => {
    let result: ReturnType<typeof useIntersectionObserver> | undefined;

    const Component = () => {
      result = useIntersectionObserver();
      return (
        <div ref={result.ref as React.RefObject<HTMLDivElement>}>Test</div>
      );
    };

    render(<Component />);

    expect(result?.ref).toBeDefined();
    expect(result?.entry).toBeNull();
    expect(result?.isIntersecting).toBe(false);
  });

  it("should observe the element", () => {
    const Component = () => {
      const { ref } = useIntersectionObserver();
      return <div ref={ref as React.RefObject<HTMLDivElement>}>Test</div>;
    };

    render(<Component />);

    expect(mockObserve).toHaveBeenCalled();
  });

  it("should update isIntersecting when element becomes visible", async () => {
    let result: ReturnType<typeof useIntersectionObserver> | undefined;

    const Component = () => {
      result = useIntersectionObserver();
      return (
        <div ref={result.ref as React.RefObject<HTMLDivElement>}>Test</div>
      );
    };

    render(<Component />);

    const mockEntry = {
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      isIntersecting: true,
      rootBounds: null,
      target: document.createElement("div"),
      time: Date.now(),
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);

    await waitFor(() => {
      expect(result?.isIntersecting).toBe(true);
      expect(result?.entry).toBe(mockEntry);
    });
  });

  it("should disconnect on unmount", () => {
    const Component = () => {
      const { ref } = useIntersectionObserver();
      return <div ref={ref as React.RefObject<HTMLDivElement>}>Test</div>;
    };

    const { unmount } = render(<Component />);
    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should pass options to IntersectionObserver", () => {
    const options = {
      root: null,
      rootMargin: "10px",
      threshold: 0.5,
    };

    const Component = () => {
      const { ref } = useIntersectionObserver(options);
      return <div ref={ref as React.RefObject<HTMLDivElement>}>Test</div>;
    };

    render(<Component />);

    expect(mockConstructorOptions).toEqual({
      root: null,
      rootMargin: "10px",
      threshold: 0.5,
    });
  });

  it("should disconnect after first intersection when once is true", async () => {
    let result: ReturnType<typeof useIntersectionObserver> | undefined;

    const Component = () => {
      result = useIntersectionObserver({ once: true });
      return (
        <div ref={result.ref as React.RefObject<HTMLDivElement>}>Test</div>
      );
    };

    render(<Component />);

    const mockEntry = {
      isIntersecting: true,
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);

    await waitFor(() => {
      expect(result?.isIntersecting).toBe(true);
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("should not disconnect when once is true but not intersecting", async () => {
    let result: ReturnType<typeof useIntersectionObserver> | undefined;

    const Component = () => {
      result = useIntersectionObserver({ once: true });
      return (
        <div ref={result.ref as React.RefObject<HTMLDivElement>}>Test</div>
      );
    };

    render(<Component />);

    const mockEntry = {
      isIntersecting: false,
    } as IntersectionObserverEntry;

    mockCallback([mockEntry]);

    await waitFor(() => {
      expect(result?.isIntersecting).toBe(false);
    });

    // Should not disconnect because it hasn't intersected yet
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it("should handle no element ref gracefully", () => {
    const Component = () => {
      const { isIntersecting } = useIntersectionObserver();
      // Don't attach the ref to any element
      return (
        <div>No ref attached, isIntersecting: {String(isIntersecting)}</div>
      );
    };

    render(<Component />);

    // Should not observe anything since ref is not attached
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("should handle IntersectionObserver being undefined (SSR)", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    const Component = () => {
      const { isIntersecting, ref } = useIntersectionObserver();
      return (
        <div ref={ref as React.RefObject<HTMLDivElement>}>
          SSR: {String(isIntersecting)}
        </div>
      );
    };

    // Should not throw
    render(<Component />);
    expect(mockObserve).not.toHaveBeenCalled();
  });
});
