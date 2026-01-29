# AI Agent Guidelines

This document provides guidance for AI coding agents working in this TypeScript monorepo. Follow these instructions to verify your implementations using the repository's linting, testing, and type checking tools.

## Quick Reference

| Task       | Command          | Description                  |
| ---------- | ---------------- | ---------------------------- |
| Lint all   | `pnpm lint`      | Check code style and quality |
| Test all   | `pnpm test`      | Run all tests                |
| Type check | `pnpm typecheck` | Verify TypeScript types      |
| Format     | `pnpm format`    | Format code with Prettier    |

## Verification Workflow

After making changes, **always run verification** to ensure your implementation is correct:

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test
```

If any command fails, fix the issues before considering the task complete.

## Iterative Fix Workflow

When fixing a specific issue (e.g., a lint error or a single failing test), use targeted commands for faster feedback:

1. **Fix the issue** in your code
2. **Run the specific verification** for that issue type:

   ```bash
   # After fixing a lint issue
   pnpm lint

   # After fixing a type error
   pnpm typecheck

   # After fixing a failing test
   pnpm test
   ```

3. **Once the targeted check passes**, run the full verification loop:
   ```bash
   pnpm format && pnpm lint && pnpm typecheck && pnpm test
   ```

This avoids running all checks repeatedly while iterating on a fix. Turbo caches unchanged packages, so the full verification is fast after targeted work.

> **Note**: For formatting issues, `pnpm format` auto-fixes problems—just re-run it and proceed to full verification.

## Package Manager

This monorepo uses **pnpm**. Always use `pnpm` commands.

## Running Commands

### All Packages (Recommended)

Run commands from the repository root to verify all packages. Non-changed packages are cached with turbo for faster execution:

```bash
pnpm format
pnpm typecheck
pnpm lint
pnpm test
```

### Specific Package

To run commands for a specific package, use the `--filter` flag:

```bash
# For the hooks package
pnpm turbo lint --filter=@airyhooks/hooks
pnpm turbo test --filter=@airyhooks/hooks
pnpm turbo typecheck --filter=@airyhooks/hooks

# For the CLI package
pnpm turbo lint --filter=airyhooks
pnpm turbo test --filter=airyhooks
pnpm turbo typecheck --filter=airyhooks
```

Or navigate to the package directory:

```bash
cd packages/hooks && pnpm test
cd packages/cli && pnpm test
```
