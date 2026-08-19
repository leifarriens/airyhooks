import { useEffect, useRef } from "react";

type EventListenerTarget = Pick<
  EventTarget,
  "addEventListener" | "removeEventListener"
>;

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

  const listenerRef = useRef<null | {
    eventListener: typeof handler;
    eventName: string;
    options: AddEventListenerOptions | boolean | undefined;
    target: EventListenerTarget;
  }>(null);

  useEffect(() => {
    const targetElement =
      element === undefined
        ? window
        : isEventListenerTarget(element)
          ? element
          : element.current;

    const currentListener = listenerRef.current;
    if (
      currentListener !== null &&
      (currentListener.eventName !== eventName ||
        currentListener.options !== options ||
        currentListener.target !== targetElement)
    ) {
      currentListener.target.removeEventListener(
        currentListener.eventName,
        currentListener.eventListener,
        currentListener.options,
      );
      listenerRef.current = null;
    }

    if (isEventListenerTarget(targetElement) && listenerRef.current === null) {
      const eventListener: typeof handler = (event) => {
        savedHandler.current(event);
      };

      targetElement.addEventListener(eventName, eventListener, options);
      listenerRef.current = {
        eventListener,
        eventName,
        options,
        target: targetElement,
      };
    }
  });

  useEffect(() => {
    return () => {
      const currentListener = listenerRef.current;
      if (currentListener) {
        currentListener.target.removeEventListener(
          currentListener.eventName,
          currentListener.eventListener,
          currentListener.options,
        );
        listenerRef.current = null;
      }
    };
  }, []);
}

function isEventListenerTarget(value: unknown): value is EventListenerTarget {
  return (
    value !== null &&
    typeof value === "object" &&
    "addEventListener" in value &&
    typeof value.addEventListener === "function" &&
    "removeEventListener" in value &&
    typeof value.removeEventListener === "function"
  );
}
