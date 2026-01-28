# airyhooks

A zero-dependency, TypeScript-first React hooks library delivered via CLI.

> **For end-user documentation**, see the [CLI package README](packages/cli/README.md) or [npm package page](https://www.npmjs.com/package/airyhooks).

This repository is a monorepo containing:

- `packages/hooks` — Hook implementations with comprehensive tests
- `packages/cli` — CLI tool for adding hooks to projects
- `configs` — Shared ESLint and TypeScript configurations

## 🚀 Getting Started

### Installation

Install dependencies:

```bash
pnpm install
```

### Build All Packages

```bash
pnpm turbo build
```

## 🧪 Development & Testing

### Running Tests

Run all tests across packages:

```bash
pnpm test
```

Run tests with coverage:

```bash
cd packages/hooks
pnpm test -- --coverage
```

### Testing the CLI Locally

#### Option 1: Global Link (Recommended)

```bash
# Build and create global link
pnpm turbo build
cd packages/cli
pnpm link --global

# Test in any project
airyhooks init
airyhooks list
airyhooks add useDebounce

# Unlink when done
pnpm unlink --global
```

#### Option 2: Run Directly

```bash
cd packages/cli
pnpm build
node dist/index.js init
node dist/index.js list
node dist/index.js add useDebounce
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

## How It Works

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

1. All tests pass: `pnpm test`
2. Types check: `pnpm typecheck`
3. Code lints: `pnpm lint`
4. Test coverage maintained (currently 94%+)
5. Update CLI registry when adding new hooks
6. Regenerate templates: `pnpm --filter @airyhooks/hooks build:templates`

### Release Process

```bash
# Bump version in packages/cli/package.json
cd packages/cli
npm publish --access public
```
