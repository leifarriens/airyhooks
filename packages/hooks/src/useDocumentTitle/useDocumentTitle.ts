import { useEffect, useRef } from "react";

/**
 * Dynamically update the document title.
 *
 * @param title - The title to set for the document
 * @param restoreOnUnmount - Whether to restore the previous title on unmount (default: true)
 *
 * @example
 * // Basic usage
 * useDocumentTitle('Home | My App');
 *
 * @example
 * // Dynamic title based on state
 * useDocumentTitle(`${unreadCount} new messages`);
 *
 * @example
 * // Don't restore title on unmount
 * useDocumentTitle('Dashboard', false);
 */
export function useDocumentTitle(title: string, restoreOnUnmount = true): void {
  const previousTitle = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    // Store the previous title only on first mount
    previousTitle.current ??= document.title;

    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (restoreOnUnmount && previousTitle.current !== undefined) {
        document.title = previousTitle.current;
      }
    };
  }, [restoreOnUnmount]);
}
