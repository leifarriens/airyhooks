import { useCallback, useSyncExternalStore } from "react";

/**
 * Reacts to CSS media query changes.
 *
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns Whether the media query matches
 *
 * @example
 * const isMobile = useMedia("(max-width: 768px)");
 * const isDarkMode = useMedia("(prefers-color-scheme: dark)");
 *
 * return (
 *   <div>
 *     <p>Is mobile: {isMobile ? "Yes" : "No"}</p>
 *     <p>Dark mode: {isDarkMode ? "Yes" : "No"}</p>
 *   </div>
 * );
 */
export function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = getMediaQueryList(query, true);
      if (!mediaQueryList) {
        return () => undefined;
      }

      const handleChange = () => {
        onStoreChange();
      };

      if (typeof mediaQueryList.addEventListener === "function") {
        mediaQueryList.addEventListener("change", handleChange);
        return () => {
          mediaQueryList.removeEventListener("change", handleChange);
        };
      }

      // Older browsers expose the deprecated addListener API instead.
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      mediaQueryList.addListener(handleChange);
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        mediaQueryList.removeListener(handleChange);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => getMediaQueryList(query)?.matches ?? false,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function getMediaQueryList(
  query: string,
  warnOnError = false,
): MediaQueryList | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.matchMedia(query);
  } catch (error) {
    if (warnOnError) {
      console.warn(`Invalid media query: "${query}"`, error);
    }
    return null;
  }
}
