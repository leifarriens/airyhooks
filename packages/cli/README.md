# airyhooks

Add production-ready React hooks directly to your project—no package installation required.

airyhooks is a CLI tool that lets you add battle-tested, TypeScript-first React hooks directly to your codebase. Instead of installing a package, you copy exactly what you need. This gives you complete control: modify hooks for your use case, avoid dependency bloat, and eliminate version conflicts.

```bash
pnpm dlx airyhooks@latest add useDebounce
```

## Why airyhooks?

- **Zero Dependencies**: Hooks only depend on React—nothing else
- **Full Ownership**: Code lives in your repo; customize freely
- **TypeScript Native**: Complete type safety with generics
- **Battle-Tested**: 50+ tests, 94%+ coverage
- **One Command**: Add hooks instantly with the CLI

## 🚀 Quick Start

### 1. Initialize

Create the configuration file and set your hooks directory:

```bash
pnpm dlx airyhooks@latest init
```

This creates `airyhooks.json` in your project root and prompts you for the hooks directory path (default: `./hooks`).

### 2. Add a Hook

Add any hook to your project:

```bash
pnpm dlx airyhooks@latest add useDebounce
```

This creates the following structure:

```
hooks/
├── useDebounce/
│   ├── useDebounce.ts
│   └── index.ts
```

### 3. Use in Your Code

Import and use the hook in your components:

```tsx
import { useDebounce } from "./hooks/useDebounce";

export function SearchComponent() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Searching for: {debouncedValue}</p>
    </div>
  );
}
```

## 📖 Commands

### `airyhooks init`

Initialize airyhooks in your project. Creates `airyhooks.json` configuration file and prompts for your hooks directory path.

```bash
pnpm dlx airyhooks@latest init
# or
npx airyhooks@latest init
```

### `airyhooks add <hook-name>`

Add a specific hook to your project. Creates the hook directory with TypeScript files.

```bash
pnpm dlx airyhooks@latest add useDebounce
```

### `airyhooks list`

List all available hooks with descriptions.

```bash
pnpm dlx airyhooks@latest list
```

## 📚 Available Hooks

| Hook                | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `useDebounce`       | Debounce a value with a specified delay                 |
| `useThrottle`       | Throttle a value to update at most once per interval    |
| `useLocalStorage`   | Sync state with localStorage                            |
| `useSessionStorage` | Sync state with sessionStorage                          |
| `usePrevious`       | Track previous state or props value                     |
| `useToggle`         | Toggle a boolean value with convenient handlers         |
| `useBoolean`        | Boolean state with setTrue, setFalse, and toggle        |
| `useMount`          | Call a callback on component mount                      |
| `useUnmount`        | Call a callback on component unmount                    |
| `useInterval`       | Call a callback at specified intervals                  |
| `useTimeout`        | Call a callback after a timeout                         |
| `useClickAway`      | Detect clicks outside of an element                     |
| `useWindowSize`     | Track window dimensions                                 |
| `useCounter`        | Manage numeric state with increment/decrement/reset/set |
| `useHover`          | Track mouse hover state on elements                     |
| `useKeyPress`       | Detect specific keyboard key presses                    |
| `useMedia`          | React to CSS media query changes                        |
| `useScroll`         | Track scroll position of element or window              |

## 💡 Usage Example

Here's a complete example using `useDebounce` for a search input:

```tsx
import { useState } from "react";
import { useDebounce } from "./hooks/useDebounce";

export function App() {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 1000);

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {debouncedInput}</p>
    </div>
  );
}
```

## ⚙️ Configuration

The `airyhooks.json` file stores your configuration:

```json
{
  "hooksPath": "./hooks"
}
```

You can manually edit this file to change the hooks directory path.

## 📦 Package Managers

airyhooks works with all major package managers:

```bash
# pnpm
pnpm dlx airyhooks@latest add useDebounce

# npm
npx airyhooks@latest add useDebounce

# yarn
yarn dlx airyhooks@latest add useDebounce

# bun
bunx airyhooks@latest add useDebounce
```

## 📄 License

MIT

---

**Ready to use?** Run `pnpm dlx airyhooks@latest init` to get started!
