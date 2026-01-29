import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useDocumentTitle } from "./useDocumentTitle.js";

describe("useDocumentTitle", () => {
  const originalTitle = "Original Title";

  beforeEach(() => {
    document.title = originalTitle;
  });

  afterEach(() => {
    cleanup();
    document.title = originalTitle;
  });

  it("should set the document title", () => {
    renderHook(() => {
      useDocumentTitle("New Title");
    });

    expect(document.title).toBe("New Title");
  });

  it("should update the document title when title changes", () => {
    const { rerender } = renderHook(
      ({ title }) => {
        useDocumentTitle(title);
      },
      {
        initialProps: { title: "First Title" },
      },
    );

    expect(document.title).toBe("First Title");

    rerender({ title: "Second Title" });
    expect(document.title).toBe("Second Title");
  });

  it("should restore original title on unmount by default", () => {
    const { unmount } = renderHook(() => {
      useDocumentTitle("Temporary Title");
    });

    expect(document.title).toBe("Temporary Title");

    unmount();
    expect(document.title).toBe(originalTitle);
  });

  it("should not restore title on unmount when restoreOnUnmount is false", () => {
    const { unmount } = renderHook(() => {
      useDocumentTitle("Permanent Title", false);
    });

    expect(document.title).toBe("Permanent Title");

    unmount();
    expect(document.title).toBe("Permanent Title");
  });

  it("should restore the initial title, not intermediate titles", () => {
    const { rerender, unmount } = renderHook(
      ({ title }) => {
        useDocumentTitle(title);
      },
      { initialProps: { title: "First" } },
    );

    expect(document.title).toBe("First");

    rerender({ title: "Second" });
    expect(document.title).toBe("Second");

    rerender({ title: "Third" });
    expect(document.title).toBe("Third");

    unmount();
    expect(document.title).toBe(originalTitle);
  });
});
