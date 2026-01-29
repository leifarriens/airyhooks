import { useCallback, useEffect, useRef, useState } from "react";

export interface UseFetchOptions<T> {
  /** Whether to fetch immediately on mount (default: true) */
  immediate?: boolean;
  /** Initial data before fetch completes */
  initialData?: T;
}

export interface UseFetchResult<T> {
  /** The fetched data, or undefined if not yet loaded */
  data: T | undefined;
  /** Error object if the fetch failed */
  error: Error | null;
  /** Whether a fetch is currently in progress */
  isLoading: boolean;
  /** Function to manually trigger a refetch */
  refetch: () => Promise<void>;
}

/**
 * Fetch data from a URL with loading and error states.
 *
 * @param url - The URL to fetch data from
 * @param options - Configuration options
 * @returns Object containing data, loading state, error, and refetch function
 *
 * @example
 * const { data, isLoading, error, refetch } = useFetch<User[]>('/api/users');
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <UserList users={data} />;
 *
 * @example
 * // With initial data and manual fetch
 * const { data, refetch } = useFetch<User>('/api/user', {
 *   initialData: { name: 'Loading...' },
 *   immediate: false,
 * });
 */
export function useFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {},
): UseFetchResult<T> {
  const { immediate = true, initialData } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${String(response.status)}`);
      }

      const result = (await response.json()) as T;
      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      void fetchData();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData, immediate]);

  return { data, error, isLoading, refetch: fetchData };
}
