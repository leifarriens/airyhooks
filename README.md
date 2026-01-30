# airyhooks

A zero-dependency, TypeScript-first React hooks library delivered via CLI.

> [!IMPORTANT]  
> **For user documentation**, see the [CLI package README](/packages/cli/README.md) or [npm package page](https://www.npmjs.com/package/airyhooks).

This repository is a monorepo containing:

- `packages/hooks` — Hook implementations with comprehensive tests
- `packages/cli` — CLI tool for adding hooks to projects
- `configs` — Shared ESLint and TypeScript configurations

## Development Setup

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

### Testing the CLI Locally

#### Option 1: Global Link

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

# For specific package
pnpm --filter @airyhooks/hooks test
pnpm --filter airyhooks lint
```

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
6. Verify:

```bash
pnpm lint && pnpm typecheck && pnpm test
```

> **Note**: Templates are automatically generated when building the CLI via Turborepo's dependency chain.

### Auto-Generated Templates

Hook templates are automatically generated from source files via Turborepo's dependency chain. When you build the CLI with `pnpm turbo build`, the hooks package's `build:templates` script runs automatically, ensuring the CLI always has the latest hook implementations.

You can also generate templates manually if needed:

```bash
pnpm --filter @airyhooks/hooks build:templates
```

## How It Works

1. **CLI**: `airyhooks add useDebounce` reads the template from the registry
2. **Template Generation**: Automatically generated from `packages/hooks/src/useDebounce/useDebounce.ts`
3. **File Creation**: Hook and barrel export are written to your project
4. **Usage**: Import directly from your local hooks directory

## 🤝 Contributing

### Contributing Workflow

1. Fork the repository and create a feature branch
2. Make your changes
3. Run quality checks: `pnpm lint && pnpm typecheck && pnpm test`
4. Create a changeset to document your changes:

```bash
pnpm changeset
```

5. Commit your changes and changeset file
6. Submit a pull request

### Release Process (Maintainers Only)

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing. **Releases are automated via GitHub Actions.**

When changesets are merged to `main`, the [release workflow](.github/workflows/release.yaml) automatically:

1. Runs quality checks
2. Builds all packages
3. Creates a "Version Packages" PR that bumps versions based on changesets
4. When that PR is merged, publishes packages to npm automatically

**Manual release** (if needed):

```bash
# 1. Run quality checks
pnpm lint && pnpm typecheck && pnpm test

# 2. Build all packages
pnpm turbo build

# 3. Version packages based on changesets
pnpm changeset version

# 4. Publish to npm
pnpm changeset publish
```
