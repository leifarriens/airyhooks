import { useEffect, useRef } from "react";

/**
 * Attaches an event listener to a target element or window with automatic cleanup.
 *
 * @param eventName - The event type to listen for (e.g., 'click', 'scroll', 'keydown')
 * @param handler - The event handler function
 * @param element - The target element or window (default: window)
 * @param options - Event listener options (capture, passive, once)
 *
 * @example
 * // Listen for clicks on window
 * useEventListener('click', (e) => console.log('Clicked!'));
 *
 * @example
 * // Listen for clicks on a specific element
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener('click', handleClick, buttonRef);
 *
 * @example
 * // With options
 * useEventListener('scroll', handleScroll, window, { passive: true });
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window,
  options?: AddEventListenerOptions | boolean,
): void;
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: React.RefObject<null | T>,
  options?: AddEventListenerOptions | boolean,
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: AddEventListenerOptions | boolean,
): void;
export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KD extends keyof DocumentEventMap,
  T extends HTMLElement = HTMLElement,
>(
  eventName: KD | KH | KW,
  handler: (
    event:
      | DocumentEventMap[KD]
      | Event
      | HTMLElementEventMap[KH]
      | WindowEventMap[KW],
  ) => void,
  element?: Document | React.RefObject<null | T> | Window,
  options?: AddEventListenerOptions | boolean,
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    let targetElement: Document | Element | null | Window;

    if (element === undefined) {
      targetElement = window;
    } else if (element instanceof Document || element instanceof Window) {
      targetElement = element;
    } else {
      targetElement = element.current;
    }

    if (!targetElement?.addEventListener) {
      return;
    }

    const eventListener: typeof handler = (event) => {
      savedHandler.current(event);
    };

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}
