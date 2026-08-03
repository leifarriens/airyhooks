import { useEffect } from "react";

interface BodyLockState {
  count: number;
  originalOverflow: string;
}

const bodyLockStates = new WeakMap<Document, BodyLockState>();

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
  useEffect(() => {
    if (typeof document === "undefined" || !lock) {
      return;
    }

    const body = document.body;
    const state = bodyLockStates.get(document) ?? {
      count: 0,
      originalOverflow: body.style.overflow,
    };

    state.count += 1;
    bodyLockStates.set(document, state);
    body.style.overflow = "hidden";

    return () => {
      const currentState = bodyLockStates.get(document);
      if (!currentState) {
        return;
      }

      currentState.count -= 1;
      if (currentState.count === 0) {
        body.style.overflow = currentState.originalOverflow;
        bodyLockStates.delete(document);
      }
    };
  }, [lock]);
}
