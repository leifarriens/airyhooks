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
pnpm turbo lint --filter=@la/core
pnpm turbo test --filter=@la/api
pnpm turbo typecheck --filter=@la/core
```

Or navigate to the package directory:

```bash
cd packages/core && pnpm test
```
