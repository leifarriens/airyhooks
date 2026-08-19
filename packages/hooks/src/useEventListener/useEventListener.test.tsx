import { cleanup, fireEvent, render } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useEventListener } from "./useEventListener.js";

describe("useEventListener", () => {
  afterEach(() => {
    cleanup();
  });

  it("should add event listener to window by default", () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(window, "addEventListener");

    const Component = () => {
      useEventListener("click", handler);
      return null;
    };

    render(<Component />);

    expect(addSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined,
    );
    addSpy.mockRestore();
  });

  it("should call handler when event is fired on window", () => {
    const handler = vi.fn();

    const Component = () => {
      useEventListener("click", handler);
      return null;
    };

    render(<Component />);

    fireEvent.click(window);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should add event listener to ref element", () => {
    const handler = vi.fn();

    const Component = () => {
      const ref = React.useRef<HTMLButtonElement>(null);
      useEventListener("click", handler, ref);
      return <button ref={ref}>Click me</button>;
    };

    const { getByText } = render(<Component />);

    fireEvent.click(getByText("Click me"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not fire handler when clicking outside ref element", () => {
    const handler = vi.fn();

    const Component = () => {
      const ref = React.useRef<HTMLButtonElement>(null);
      useEventListener("click", handler, ref);
      return (
        <div>
          <button ref={ref}>Target</button>
          <button>Other</button>
        </div>
      );
    };

    const { getByText } = render(<Component />);

    fireEvent.click(getByText("Other"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("should follow a ref when its target element is replaced", () => {
    const handler = vi.fn();

    const Component = ({ id }: { id: string }) => {
      const ref = React.useRef<HTMLButtonElement>(null);
      useEventListener("click", handler, ref);
      return (
        <button key={id} ref={ref}>
          {id}
        </button>
      );
    };

    const { getByText, rerender } = render(<Component id="first" />);
    const firstButton = getByText("first");
    rerender(<Component id="second" />);
    const secondButton = getByText("second");

    fireEvent.click(firstButton);
    fireEvent.click(secondButton);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should add event listener to document", () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(document, "addEventListener");

    const Component = () => {
      useEventListener("click", handler, document);
      return null;
    };

    render(<Component />);

    expect(addSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined,
    );
    addSpy.mockRestore();
  });

  it("should add an event listener to an iframe window", () => {
    const handler = vi.fn();
    const iframe = document.createElement("iframe");
    document.body.append(iframe);

    try {
      const iframeWindow = iframe.contentWindow;
      if (!iframeWindow) {
        throw new Error("Expected iframe window");
      }

      const Component = () => {
        useEventListener("click", handler, iframeWindow);
        return null;
      };

      render(<Component />);
      iframeWindow.dispatchEvent(new Event("click"));
      expect(handler).toHaveBeenCalledTimes(1);
    } finally {
      iframe.remove();
    }
  });

  it("should add an event listener to an iframe document", () => {
    const handler = vi.fn();
    const iframe = document.createElement("iframe");
    document.body.append(iframe);

    try {
      const iframeDocument = iframe.contentDocument;
      if (!iframeDocument) {
        throw new Error("Expected iframe document");
      }

      const Component = () => {
        useEventListener("click", handler, iframeDocument);
        return null;
      };

      render(<Component />);
      iframeDocument.dispatchEvent(new Event("click"));
      expect(handler).toHaveBeenCalledTimes(1);
    } finally {
      iframe.remove();
    }
  });

  it("should remove event listener on unmount", () => {
    const handler = vi.fn();
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const Component = () => {
      useEventListener("click", handler);
      return null;
    };

    const { unmount } = render(<Component />);
    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined,
    );
    removeSpy.mockRestore();
  });

  it("should pass options to event listener", () => {
    const handler = vi.fn();
    const addSpy = vi.spyOn(window, "addEventListener");
    const options = { capture: true, passive: true };

    const Component = () => {
      useEventListener("scroll", handler, undefined, options);
      return null;
    };

    render(<Component />);

    expect(addSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      options,
    );
    addSpy.mockRestore();
  });

  it("should update handler without re-adding listener", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const addSpy = vi.spyOn(window, "addEventListener");

    const Component = ({ handler }: { handler: () => void }) => {
      useEventListener("click", handler);
      return null;
    };

    const { rerender } = render(<Component handler={handler1} />);
    expect(addSpy).toHaveBeenCalledTimes(1);

    rerender(<Component handler={handler2} />);

    fireEvent.click(window);
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);

    addSpy.mockRestore();
  });

  it("should handle keydown events", () => {
    const handler = vi.fn();

    const Component = () => {
      useEventListener("keydown", handler);
      return null;
    };

    render(<Component />);

    fireEvent.keyDown(window, { key: "Enter" });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
