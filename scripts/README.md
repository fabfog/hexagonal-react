# Project Scripts

Utility scripts for project maintenance.

## remove-demo.sh

Removes all demo/task-manager code from the project to start with a clean slate.

### Usage

```bash
pnpm remove:demo
```

### What it removes

- **Domain**: `packages/domain/src/demo/`
- **Use Cases**: `packages/use-cases/src/demo/`
- **Ports**: `packages/ports/src/demo/`
- **Repositories**: Task repository implementations
- **ViewModels**: `task-list.viewmodel.ts`
- **UI Components**: Task list components from both apps
- **DI Container**: Resets to minimal setup
- **Next.js Config**: Removes `@repo/adapter-demo` from `transpilePackages`

### After running

1. Run `pnpm install`
2. Run `pnpm build`
3. Run `pnpm dev`
4. Start creating your features with `pnpm gen`

The script creates a clean starting point with:
- All packages properly configured
- Empty DI containers ready for your code
- Clean home pages in both apps
- All code generators available

**Note**: This script automatically removes itself after execution.

---

## remove-adapter.sh

Removes an adapter package from the monorepo and cleans up all references.

### Usage

```bash
pnpm remove:adapter <adapter-name>
```

### Examples

```bash
pnpm remove:adapter adapter-demo
pnpm remove:adapter adapter-postgres
pnpm remove:adapter @repo/adapter-redis
```

### What it does

- Removes the package directory from `packages/`
- Removes from `transpilePackages` in all Next.js configs
- Works with both `adapter-name` and `@repo/adapter-name` formats

### After running

1. Run `pnpm install`
2. Remove any imports of the adapter from your code
3. Run `pnpm build`
