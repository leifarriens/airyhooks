import { useEffect, useState } from "react";

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
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (SSR safety)
    if (typeof window === "undefined") {
      return undefined;
    }

    try {
      const mediaQueryList = window.matchMedia(query);

      // Set initial value
      setMatches(mediaQueryList.matches);

      // Create listener function
      const handleChange = (e: MediaQueryListEvent) => {
        setMatches(e.matches);
      };

      // Modern browsers use addEventListener
      mediaQueryList.addEventListener("change", handleChange);
      return () => {
        mediaQueryList.removeEventListener("change", handleChange);
      };
    } catch (error) {
      console.warn(`Invalid media query: "${query}"`, error);
      return undefined;
    }
  }, [query]);

  return matches;
}
