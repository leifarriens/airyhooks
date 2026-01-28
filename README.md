# airyhooks

A zero-dependency, TypeScript-first React hooks library. Add battle-tested hooks directly to your project with a simple CLI command.

```bash
pnpm dlx airyhooks@latest add useDebounce
```

## ✨ Features

- **12 Production-Ready Hooks** — Common React patterns you'll reach for immediately
- **Zero Dependencies** — Hooks only depend on React
- **TypeScript First** — Full type safety with comprehensive generics
- **Copy, Don't Install** — Add hooks directly to your codebase for maximum control
- **Well-Tested** — 50+ tests with 94%+ coverage, edge cases included
- **Fully Documented** — JSDoc comments and usage examples for every hook

## 📚 Available Hooks

| Hook              | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `useDebounce`     | Delay value updates by N milliseconds           |
| `useThrottle`     | Limit updates to max once per interval          |
| `useLocalStorage` | Sync state with localStorage, cross-tab support |
| `usePrevious`     | Track the previous value of any variable        |
| `useToggle`       | Boolean state with toggle function              |
| `useBoolean`      | Enhanced boolean state with typed handlers      |
| `useMount`        | Run side effects on component mount             |
| `useUnmount`      | Run side effects on component unmount           |
| `useInterval`     | Manage intervals with pause support             |
| `useTimeout`      | Manage timeouts with cancellation               |
| `useClickAway`    | Detect clicks outside an element                |
| `useWindowSize`   | Track window dimensions                         |

## 🚀 Quick Start

### Installation

```bash
pnpm install
```

### Add a Hook to Your Project

First, initialize airyhooks in your project:

```bash
pnpm dlx airyhooks@latest init
```

Then add any hook:

```bash
pnpm dlx airyhooks@latest add useDebounce
```

This creates the following structure in your project:

```
hooks/
├── useDebounce/
│   ├── useDebounce.ts
│   └── index.ts
```

Import and use:

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

### View Available Hooks

```bash
pnpm dlx airyhooks@latest list
```

## 🧪 Testing

### Option 1: Build & Link (Recommended for Development)

Create a global link to test the CLI locally:

```bash
# In the airyhooks directory
pnpm install
pnpm turbo build

# Create global link
cd packages/cli
pnpm link --global
```

Then in any project:

```bash
airyhooks init
airyhooks list
airyhooks add useDebounce
```

Unlink when done:

```bash
pnpm unlink --global
```

### Option 2: Run CLI Directly

```bash
cd /home/leif/airyhooks/packages/cli
pnpm build
node dist/index.js init
node dist/index.js list
node dist/index.js add useDebounce
```

### Option 3: Test in Fresh Project

```bash
# Create a test directory
cd /tmp && mkdir test-airyhooks-project && cd test-airyhooks-project

# Install and initialize
pnpm install
mkdir hooks

# Copy a hook from the repository manually or use linked CLI
cp -r /path/to/airyhooks/packages/hooks/src/useDebounce hooks/
```

## 🏗️ Project Structure

```
airyhooks/
├── packages/
│   ├── hooks/              # Hook implementations
│   │   ├── src/            # Individual hooks with tests
│   │   └── scripts/        # Template generation
│   └── cli/                # CLI application
│       ├── src/
│       │   ├── commands/   # init, add, list commands
│       │   └── utils/      # Registry, templates, config
│       └── index.ts        # CLI entry point
├── configs/
│   ├── eslint/             # Shared ESLint config
│   └── typescript/         # Shared TypeScript configs
└── turbo.json              # Turborepo pipeline
```

## ✅ Quality Checks

Verify the project with Turbo caching:

```bash
# Run all checks
pnpm lint && pnpm typecheck && pnpm test

# Or run individually
pnpm lint                    # ESLint check
pnpm lint:fix                # Auto-fix linting issues
pnpm typecheck              # TypeScript check
pnpm test                   # Vitest with coverage

# For specific package
pnpm --filter @airyhooks/hooks test
pnpm --filter airyhooks lint
```

### Test Coverage

Run tests with coverage report:

```bash
cd packages/hooks
pnpm test -- --coverage
```

Current coverage:

- **Statements**: 95%
- **Branches**: 84.61%
- **Functions**: 100%
- **Lines**: 94.84%

## 🔧 Development Workflow

### Adding a New Hook

1. Create hook structure:

```bash
mkdir packages/hooks/src/useMyHook
touch packages/hooks/src/useMyHook/useMyHook.ts
touch packages/hooks/src/useMyHook/useMyHook.test.ts
touch packages/hooks/src/useMyHook/index.ts
```

2. Implement the hook with JSDoc comments
3. Write comprehensive tests
4. Add barrel export to `index.ts`
5. Update registry in `packages/cli/src/utils/registry.ts`
6. Regenerate templates:

```bash
pnpm --filter @airyhooks/hooks build:templates
```

7. Verify:

```bash
pnpm lint && pnpm typecheck && pnpm test
```

### Auto-Generated Templates

Hook templates are automatically generated from source files. After adding or modifying hooks, run:

```bash
pnpm --filter @airyhooks/hooks build:templates
```

This ensures the CLI always has the latest hook implementations.

## 📝 Example: useDebounce

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

## 📦 How It Works

1. **CLI**: `airyhooks add useDebounce` reads the template from the registry
2. **Template Generation**: Automatically generated from `packages/hooks/src/useDebounce/useDebounce.ts`
3. **File Creation**: Hook and barrel export are written to your project
4. **Usage**: Import directly from your local hooks directory

## 🛠️ Tech Stack

- **Monorepo**: [Turborepo](https://turbo.build/) with pnpm workspaces
- **Language**: TypeScript 5.9+ with strict mode
- **Testing**: Vitest 4+ with jsdom
- **CLI**: Commander.js
- **Code Quality**: ESLint 9+, Prettier 3+

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please ensure:

1. Tests pass: `pnpm test`
2. Types check: `pnpm typecheck`
3. Code lints: `pnpm lint`
4. Coverage maintained: `pnpm test -- --coverage`

---

**Ready to use?** Run `pnpm dlx airyhooks@latest init` to get started!
