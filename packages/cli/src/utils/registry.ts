export interface HookDefinition {
  dependencies?: string[];
  description: string;
  name: string;
}

export const registry: HookDefinition[] = [
  {
    description: "Debounce a value with a specified delay",
    name: "useDebounce",
  },
  {
    description: "Debounce a callback function with cancel support",
    name: "useDebouncedCallback",
  },
  {
    description: "Throttle a value to update at most once per interval",
    name: "useThrottle",
  },
  {
    description: "Throttle a callback function with leading/trailing options",
    name: "useThrottledCallback",
  },
  {
    description: "Sync state with localStorage",
    name: "useLocalStorage",
  },
  {
    description: "Track previous state or props value",
    name: "usePrevious",
  },
  {
    description: "Toggle a boolean value with convenient handlers",
    name: "useToggle",
  },
  {
    description: "Boolean state with setTrue, setFalse, and toggle handlers",
    name: "useBoolean",
  },
  {
    description: "Call a callback on component mount",
    name: "useMount",
  },
  {
    description: "Call a callback on component unmount",
    name: "useUnmount",
  },
  {
    description: "Call a callback at specified intervals",
    name: "useInterval",
  },
  {
    description: "Call a callback after a timeout",
    name: "useTimeout",
  },
  {
    description: "Detect clicks outside of an element",
    name: "useClickAway",
  },
  {
    description: "Track window dimensions",
    name: "useWindowSize",
  },
  {
    description: "Manage numeric state with increment/decrement/reset/set",
    name: "useCounter",
  },
  {
    description: "Sync state with sessionStorage",
    name: "useSessionStorage",
  },
  {
    description: "Track mouse hover state on elements",
    name: "useHover",
  },
  {
    description: "Detect specific keyboard key presses",
    name: "useKeyPress",
  },
  {
    description: "React to CSS media query changes",
    name: "useMedia",
  },
  {
    description: "Track scroll position of element or window",
    name: "useScroll",
  },
  {
    description: "Copy text to the clipboard",
    name: "useCopyToClipboard",
  },
  {
    description: "Listen for events on a target element",
    name: "useEventListener",
  },
  {
    description: "Fetch data with loading and error states",
    name: "useFetch",
  },
  {
    description: "Track visibility of DOM elements in viewport",
    name: "useIntersectionObserver",
  },
  {
    description: "Dynamically update the document title",
    name: "useDocumentTitle",
  },
  {
    description: "Temporarily disable body scrolling",
    name: "useLockBodyScroll",
  },
  {
    description: "Measure component dimensions with ResizeObserver",
    name: "useMeasure",
  },
  {
    description: "Check if running on client-side (SSR-safe)",
    name: "useIsClient",
  },
];
