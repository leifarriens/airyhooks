import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useFetch } from "./useFetch.js";

describe("useFetch", () => {
  const mockData = { id: 1, name: "Test" };

  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
        ok: true,
      } as Response),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch data immediately by default", async () => {
    const { result } = renderHook(() => useFetch<typeof mockData>("/api/test"));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("should not fetch immediately when immediate is false", () => {
    const { result } = renderHook(() =>
      useFetch<typeof mockData>("/api/test", { immediate: false }),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should use initial data", () => {
    const initialData = { id: 0, name: "Initial" };
    const { result } = renderHook(() =>
      useFetch<typeof mockData>("/api/test", {
        immediate: false,
        initialData,
      }),
    );

    expect(result.current.data).toEqual(initialData);
  });

  it("should handle fetch errors", async () => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response),
    );

    const { result } = renderHook(() => useFetch<typeof mockData>("/api/test"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("HTTP error! status: 404");
  });

  it("should handle network errors", async () => {
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.reject(new Error("Network error")),
    );

    const { result } = renderHook(() => useFetch<typeof mockData>("/api/test"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error?.message).toBe("Network error");
  });

  it("should refetch data when refetch is called", async () => {
    const { result } = renderHook(() =>
      useFetch<typeof mockData>("/api/test", { immediate: false }),
    );

    expect(global.fetch).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.refetch();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockData);
  });

  it("should refetch when URL changes", async () => {
    const { rerender, result } = renderHook(
      ({ url }) => useFetch<typeof mockData>(url),
      { initialProps: { url: "/api/test1" } },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    rerender({ url: "/api/test2" });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it("should ignore stale responses from an older request", async () => {
    const resolvers: ((response: Response) => void)[] = [];
    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvers.push(resolve);
        }),
    );

    const { result } = renderHook(() =>
      useFetch<typeof mockData>("/api/test", { immediate: false }),
    );

    let firstRequest: Promise<void> | undefined;
    let secondRequest: Promise<void> | undefined;
    act(() => {
      firstRequest = result.current.refetch();
      secondRequest = result.current.refetch();
    });

    expect(resolvers).toHaveLength(2);

    resolvers[0]?.({
      json: () => Promise.resolve({ id: 1, name: "Old" }),
      ok: true,
    } as Response);
    resolvers[1]?.({
      json: () => Promise.resolve({ id: 2, name: "New" }),
      ok: true,
    } as Response);

    await act(async () => {
      await Promise.all([firstRequest, secondRequest]);
    });

    expect(result.current.data).toEqual({ id: 2, name: "New" });
    expect(result.current.isLoading).toBe(false);
  });

  it("should keep loading until the newest request completes", async () => {
    const resolvers: ((response: Response) => void)[] = [];
    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvers.push(resolve);
        }),
    );

    const { result } = renderHook(() =>
      useFetch<typeof mockData>("/api/test", { immediate: false }),
    );

    let firstRequest: Promise<void> | undefined;
    let secondRequest: Promise<void> | undefined;
    act(() => {
      firstRequest = result.current.refetch();
      secondRequest = result.current.refetch();
    });

    resolvers[0]?.({
      json: () => Promise.resolve(mockData),
      ok: true,
    } as Response);
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(true);

    resolvers[1]?.({
      json: () => Promise.resolve(mockData),
      ok: true,
    } as Response);
    await act(async () => {
      await Promise.all([firstRequest, secondRequest]);
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("should clear loading when an immediate fetch is disabled", async () => {
    let rejectRequest: ((reason?: unknown) => void) | undefined;
    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          rejectRequest = reject;
        }),
    );

    const { rerender, result } = renderHook(
      ({ immediate }) => useFetch<typeof mockData>("/api/test", { immediate }),
      { initialProps: { immediate: true } },
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    rerender({ immediate: false });
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      rejectRequest?.(new DOMException("Aborted", "AbortError"));
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("should clear loading when URL changes and immediate fetch is disabled", async () => {
    let rejectRequest: ((reason?: unknown) => void) | undefined;
    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          rejectRequest = reject;
        }),
    );

    const { rerender, result } = renderHook(
      ({ immediate, url }) => useFetch<typeof mockData>(url, { immediate }),
      { initialProps: { immediate: true, url: "/api/first" } },
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    rerender({ immediate: false, url: "/api/second" });
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      rejectRequest?.(new DOMException("Aborted", "AbortError"));
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(false);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should clear error on successful refetch", async () => {
    vi.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      } as Response),
    );

    const { result } = renderHook(() => useFetch<typeof mockData>("/api/test"));

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
        ok: true,
      } as Response),
    );

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockData);
  });
});
