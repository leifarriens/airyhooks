# airyhooks

![airyhooks logo](/media/logo_embed.png)

Add production-ready zero-dependency React hooks without package installation directly to your project.

`airyhooks` is a CLI tool that lets you add tested, TypeScript-first React hooks directly to your codebase. Instead of installing a package, you copy exactly what you need. This gives you complete control: modify hooks for your use case, avoid dependency bloat, and eliminate version conflicts.

```bash
pnpm dlx airyhooks
```

## 🚀 Quick Start

### 1. Initialize

Create the configuration file and set your hooks directory:

```bash
pnpm dlx airyhooks init
```

This creates `airyhooks.json` in your project root and prompts you for the hooks directory path (default: `./hooks`).

> [!NOTE]  
> You can use `airyhooks` without initialization. It will use the [default configuration](/#configuration).

### 2. Start Adding Hooks

Pick from all available hooks and add them to your project:

```bash
pnpm dlx airyhooks
```

Or add a specific hook directly:

```bash
pnpm dlx airyhooks add useDebounce
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

## 📚 Available Hooks

| Hook                      | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `useClickAway`            | Detect clicks outside of an element                     |
| `useCopyToClipboard`      | Copy text to clipboard with status feedback             |
| `useCounter`              | Manage numeric state with increment/decrement/reset/set |
| `useDebounce`             | Debounce a value with a specified delay                 |
| `useDocumentTitle`        | Dynamically update the document title                   |
| `useEventListener`        | Attach event listeners with automatic cleanup           |
| `useFetch`                | Fetch data with loading, error, and refetch support     |
| `useHover`                | Track mouse hover state on elements                     |
| `useIntersectionObserver` | Track element visibility in viewport                    |
| `useInterval`             | Call a callback at specified intervals                  |
| `useIsClient`             | Check if code is running on client (SSR-safe)           |
| `useKeyPress`             | Detect specific keyboard key presses                    |
| `useLocalStorage`         | Sync state with localStorage                            |
| `useLockBodyScroll`       | Prevent body scrolling (useful for modals)              |
| `useMeasure`              | Measure element dimensions with ResizeObserver          |
| `useMedia`                | React to CSS media query changes                        |
| `useMount`                | Call a callback on component mount                      |
| `usePrevious`             | Track previous state or props value                     |
| `useScroll`               | Track scroll position of element or window              |
| `useSessionStorage`       | Sync state with sessionStorage                          |
| `useThrottle`             | Throttle a value to update at most once per interval    |
| `useTimeout`              | Call a callback after a timeout                         |
| `useToggle`               | Toggle a boolean value with convenient handlers         |
| `useUnmount`              | Call a callback on component unmount                    |
| `useWindowSize`           | Track window dimensions                                 |

## 📖 Commands

### `airyhooks init`

Initialize airyhooks in your project. Creates `airyhooks.json` configuration file and prompts for your hooks directory path.

```bash
pnpm dlx airyhooks init
# or
npx airyhooks init
```

### `airyhooks`

Run the interactive hook picker to browse and add hooks to your project.

```bash
pnpm dlx airyhooks
# or
npx airyhooks
```

### `airyhooks add <hook-name>`

Add a specific hook to your project. Creates the hook directory with TypeScript files.

```bash
pnpm dlx airyhooks add useDebounce
```

#### Options

- `--raw` - Output only the raw hook template to console (no files created)

> [!TIP]
> Use `--raw` to pipe the hook directly to a file or integrate with other tools:

```bash
pnpm dlx airyhooks add useDebounce --raw > useDebounce.ts
```

### `airyhooks list`

List all available hooks with descriptions.

```bash
pnpm dlx airyhooks list
```

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
  "casing": "camelCase",
  "hooksPath": "src/hooks",
  "importExtension": "none"
}
```

### Options

| Option            | Type                            | Default       | Description                                      |
| ----------------- | ------------------------------- | ------------- | ------------------------------------------------ |
| `hooksPath`       | `string`                        | `"src/hooks"` | Directory path where hooks are added             |
| `casing`          | `"camelCase"` \| `"kebab-case"` | `"camelCase"` | Naming convention for hook directories and files |
| `importExtension` | `"none"` \| `"js"` \| `"ts"`    | `"none"`      | File extension used in barrel export imports     |

#### `hooksPath`

The directory where hooks will be created. Can be any valid path relative to your project root.

```json
{ "hooksPath": "src/lib/hooks" }
```

#### `casing`

Controls the naming convention for hook directories and files:

- `"camelCase"` — Keeps the original hook name (e.g., `useDebounce/useDebounce.ts`)
- `"kebab-case"` — Converts to kebab-case (e.g., `use-debounce/use-debounce.ts`)

```
# camelCase (default)
hooks/useDebounce/
├── useDebounce.ts
└── index.ts

# kebab-case
hooks/use-debounce/
├── use-debounce.ts
└── index.ts
```

> [!TIP]
> You can override casing per-command with the `--kebab` flag: `airyhooks add useDebounce --kebab`

#### `importExtension`

Controls the file extension in the generated `index.ts` barrel export. Choose based on your TypeScript configuration:

| Value    | Output                                           | When to use                                         |
| -------- | ------------------------------------------------ | --------------------------------------------------- |
| `"none"` | `export { useDebounce } from "./useDebounce"`    | `moduleResolution: "bundler"` (Vite, webpack, etc.) |
| `"js"`   | `export { useDebounce } from "./useDebounce.js"` | `moduleResolution: "nodenext"` or `"node16"`        |
| `"ts"`   | `export { useDebounce } from "./useDebounce.ts"` | `allowImportingTsExtensions: true` in tsconfig      |

## 📦 Package Managers

airyhooks works with all major package managers:

```bash
# pnpm
pnpm dlx airyhooks add useDebounce

# npm
npx airyhooks add useDebounce

# yarn
yarn dlx airyhooks add useDebounce

# bun
bunx airyhooks add useDebounce
```

---

**Ready to use?** Run `pnpm dlx airyhooks init` to get started!
