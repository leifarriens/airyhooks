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
    description: "Throttle a value to update at most once per interval",
    name: "useThrottle",
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
];
