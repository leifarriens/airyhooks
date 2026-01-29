import { useEffect, useRef } from "react";

/**
 * Temporarily disable scrolling on the document body.
 * Useful for modals, drawers, and other overlays.
 *
 * @example
 * // Lock body scroll when modal is open
 * function Modal({ isOpen }) {
 *   useLockBodyScroll(isOpen);
 *
 *   if (!isOpen) return null;
 *   return <div className="modal">...</div>;
 * }
 *
 * @example
 * // Always lock when component is mounted
 * function FullscreenOverlay() {
 *   useLockBodyScroll();
 *   return <div className="overlay">...</div>;
 * }
 */
export function useLockBodyScroll(lock = true): void {
  const originalStyle = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (!lock) {
      return;
    }

    // Store the original overflow style
    originalStyle.current = document.body.style.overflow;

    // Lock the body scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Restore the original overflow style
      document.body.style.overflow = originalStyle.current ?? "";
    };
  }, [lock]);
}
