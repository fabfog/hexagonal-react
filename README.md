# Hexagonal React Monorepo

> Monorepo template enforcing hexagonal architecture via ESLint + Turborepo

**Core Mantra:** _"If it compiles, it's architecturally correct"_

## Features

- ✅ **Hexagonal Architecture** - Clean separation of concerns (Domain, Ports, Adapters, UI)
- ✅ **ESLint Enforcement** - Architecture boundaries enforced at compile-time
- ✅ **Testing with Vitest** - Ready-to-use test configuration
- ✅ **Turborepo** - Fast, scalable monorepo build system
- ✅ **Multi-App Support** - `apps/*` pattern for multiple applications
- ✅ **Composition Root** - Dependency injection enforced via ESLint
- ✅ **Technology Agnostic** - Swap adapters without touching business logic
- ✅ **Framework Flexibility** - Mix Next.js, Vite, or any framework
- ✅ **TypeScript First** - Full type safety across the monorepo
- ✅ **React 19 + Next.js 15 + Vite 5** - Latest frameworks and tools

## Architecture Layers

> **30-Second Explanation:**
> **Domain** describes _what_ exists in the business (entities, commands, events).
> **Ports** describes _what we need_ from the outside (interfaces).
> **Use-cases** describes _what to do_ (handlers with the logic).
> **Adapters** connects the outside world - _outbound_ (databases, APIs) and _inbound_ (ViewModels, CLI, controllers).
> **UI** shows _how it looks_ (pure React components).

### 📦 Domain (`@repo/domain`)

**The "words" of your business** - entities, commands, queries, events

- Contains: Task, CreateTaskCommand, TaskCreatedEvent, etc.
- **Zero logic** - only definitions and data structures
- **Zero dependencies** - only `@dxbox/use-less-react` for CQRS primitives
- ✅ Framework-agnostic, fully portable across apps

### 🔌 Ports (`@repo/ports`)

**What we need from the outside** - interfaces for external dependencies

- Contains: TaskRepositoryInterface, IEmailService, etc.
- **Only interfaces** - zero implementations
- Depends on: `@repo/domain` (for type signatures only)
- ✅ Pure TypeScript contracts

### ⚙️ Use-cases (`@repo/use-cases`)

**The "grammar" of your business** - handlers that orchestrate domain + ports

- Contains: CreateTaskHandler, GetTaskHandler, etc.
- **The actual business logic** - this is where things happen
- Depends on: `@repo/domain` + `@repo/ports`
- ✅ Framework-agnostic application services

### 🔧 Adapters (`@repo/adapter-*`)

**How to connect the outside world** - concrete implementations

In hexagonal architecture, adapters come in two flavors:

#### Outbound Adapters (`@repo/adapter-demo`, `@repo/adapter-prisma`, etc.)

**Domain → External World** - How we persist/fetch data

- Contains: InMemoryTaskRepository, PrismaTaskRepository, etc.
- Implements interfaces from Ports
- Examples: Databases, HTTP clients, Email services, File storage
- ❌ Can **ONLY** be imported in `apps/*/src/di/**` (Composition Root)
- ✅ Swappable implementations (in-memory, Prisma, REST, etc.)

#### Inbound Adapters (`@repo/adapter-viewmodels`)

**External World → Domain** - How UI/CLI/API trigger domain operations

- Contains: ViewModels (for UI), CLI commands, API controllers
- Convert external events (clicks, HTTP requests) into domain commands/queries
- Dispatch commands/queries via buses
- ❌ Can **ONLY** be imported in `apps/*/src/di/**` (Composition Root)
- ✅ Pure TypeScript classes, framework-agnostic

### 🎨 UI (`@repo/ui`)

**How it looks** - React components (pure presentation)

- Contains: TaskList, TaskForm, Button, etc.
- **Zero business logic** - only rendering
- Receive bare props
- Can import types from Domain (e.g., `Task`)
- ❌ Cannot import use-cases, ports, or adapters

Example:
```tsx
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface TasksListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TasksList({ tasks, onComplete, onDelete }: TasksListProps) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        // ... render item
      )}
    </ul>
  )
}
```

**Note:** ViewModels are now in `@repo/adapter-viewmodels` (inbound adapter). See the Adapters section above for details.

### 🚀 Apps (`apps/*`)

**Where it all comes together** - Next.js, Vite, or any framework

- Each app has its own DI container in `src/di/container.ts`
- ✅ Only place where adapters are wired to ports
- ✅ Independent deployment
- ✅ Shared architecture enforcement

## Project Structure

```
hexagonal-react/
├── hexagonal.config.js          # Architecture configuration
├── packages/
│   ├── config-typescript/       # Shared TypeScript configs
│   ├── config-eslint/           # ESLint rules enforcing architecture
│   ├── domain/                  # 📦 Business logic (modular)
│   │   └── src/
│   │       ├── demo/            # Task Manager demo module
│   │       │   ├── task.entity.ts
│   │       │   ├── create-task.command.ts
│   │       │   ├── task-created.event.ts
│   │       │   └── ...
│   │       └── index.ts         # Re-exports from modules
│   ├── ports/                   # 🔌 Interfaces (modular)
│   │   └── src/
│   │       ├── demo/            # Demo module interfaces
│   │       │   └── task-repository.interface.ts
│   │       └── index.ts
│   ├── use-cases/               # ⚙️ Handlers (modular)
│   │   └── src/
│   │       ├── demo/            # Demo module handlers
│   │       │   ├── create-task.handler.ts
│   │       │   └── ...
│   │       └── index.ts
│   ├── adapter-demo/            # 🔧 Outbound adapter (in-memory)
│   ├── adapter-viewmodels/      # 🔧 Inbound adapter (ViewModels)
│   │   └── src/
│   │       ├── task-list.viewmodel.ts
│   │       └── index.ts
│   └── ui/                      # 🎨 React components (pure presentation)
│       └── src/
│           └── task-list/       # Task list component
└── apps/
    ├── app-next/                # 🚀 Next.js SSR app (port 3000)
    │   └── src/di/              # Composition root (DI container)
    └── app-vite/                # 🚀 Vite SPA app (port 3001)
        └── src/di/              # Composition root (DI container)
```

### Modular Organization

Each layer (`domain`, `ports`, `use-cases`) is organized by **modules** (also called bounded contexts):

- **demo/** - Task Manager example (can be deleted)
- **user/** - User management (add your own)
- **product/** - Product catalog (add your own)

This structure makes it easy to:

- ✅ Add new modules without cluttering existing ones
- ✅ Remove the demo with a simple `rm -rf packages/*/src/demo`
- ✅ Scale to large projects with many domains

### Dependency Graph

```
┌─────────────────────────────────────────┐
│         Dependency Flow                  │
└─────────────────────────────────────────┘

@repo/domain (entities, commands, events)
     ↑
     │ (types only)
     │
@repo/ports (interfaces)
     ↑
     ├─────────────┐
     │             │
@repo/use-cases    @repo/adapter-* (outbound)    @repo/adapter-viewmodels (inbound)
(handlers)         (repositories, APIs, etc.)    (ViewModels, CLI, controllers)
     ↑             ↑                              ↑
     │             │                              │
     └─────┬───────┴──────────────────────────────┘
           │
      apps/* (DI)
           │
           ↓
      @repo/ui (React components)
```

**Rules:**

- ✅ Domain → Nothing (pure)
- ✅ Ports → Domain (types only)
- ✅ Use-cases → Domain + Ports
- ✅ Adapters (outbound) → Ports (+ Domain for types)
- ✅ Adapters (inbound/ViewModels) → Domain (for commands/queries) + Buses
- ✅ UI (Components) → Domain (types only), receive bare props
- ✅ Apps → Everything (wiring in DI container, instantiates ViewModels and repositories)

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm --filter app-next dev
pnpm --filter app-vite dev
```

Apps will be available at:

- **app-next** (Next.js): http://localhost:3001 - Server-side rendering, SEO optimized
- **app-vite** (Vite): http://localhost:3002 - Client-side SPA, blazing fast HMR

### Framework Flexibility

This monorepo demonstrates framework-agnostic architecture:

| Feature   | Web App (Next.js)  | Admin App (Vite)           |
| --------- | ------------------ | -------------------------- |
| Framework | Next.js 15         | Vite 5 + React 19          |
| Rendering | SSR/SSG            | SPA (Client-only)          |
| Routing   | File-based         | Client-side (add router)   |
| Use Case  | Public-facing, SEO | Internal tools, dashboards |
| Bundle    | Optimized for SSR  | Optimized for SPA          |

**Both apps:**

- ✅ Share the same domain logic (`@repo/domain`)
- ✅ Share the same use-cases (`@repo/use-cases`)
- ✅ Share the same adapters (`@repo/adapters-*`)
- ✅ Enforce the same architecture via ESLint
- ✅ Have independent DI containers (`src/di/`)

### Testing

The template includes **Vitest** configuration ready to use. Each testable package has a `test` script configured.

```bash
# Run all tests
pnpm test

# Run tests in specific package
pnpm --filter @repo/domain test

# Watch mode
pnpm --filter @repo/domain test --watch

# Coverage
pnpm --filter @repo/domain test --coverage
```

Shared Vitest configuration is available in `@repo/config-vitest`.

### Removing the Demo

The template includes a complete Task Manager demo. When you're ready to build your own application:

```bash
# Remove demo code from all layers
rm -rf packages/domain/src/demo
rm -rf packages/ports/src/demo
rm -rf packages/use-cases/src/demo
rm -rf packages/adapter-demo

# Remove demo package from workspace
# Edit pnpm-workspace.yaml and remove adapter-demo from packages list (if needed)

# Clean up DI containers in apps
# Edit apps/*/src/di/container.ts and remove demo-related imports and setup
```

Now you're ready to add your own modules!

### Build

```bash
# Build all packages and apps
pnpm build

# Build specific package/app
pnpm --filter @repo/domain build
pnpm --filter app-next build
```

### Type Check

```bash
# Type check all packages
pnpm type-check
```

### Lint

```bash
# Lint all packages (includes architecture checks)
pnpm lint
```

## Hexagonal Configuration

The `hexagonal.config.js` file defines architectural boundaries:

```javascript
module.exports = {
  // Where adapters can be imported (Composition Root)
  compositionRoots: ["apps/*/src/di/**"],

  // Package import restrictions
  packageRestrictions: {
    "@repo/domain": [
      "@repo/adapter-*", // ❌ Domain cannot import adapters
      "@repo/ports", // ❌ Domain cannot import ports
      "@repo/use-cases", // ❌ Domain cannot import use-cases
      "@repo/ui", // ❌ Domain cannot import UI
    ],
    "@repo/ports": [
      "@repo/adapter-*", // ❌ Ports cannot import adapters
      // Note: Ports CAN import @repo/domain (they define contracts using domain types/entities)
      "@repo/use-cases", // ❌ Ports cannot import use-cases
      "@repo/ui", // ❌ Ports cannot import UI
    ],
    "@repo/use-cases": [
      "@repo/adapter-*", // ❌ Use-cases cannot import adapters
      "@repo/ui", // ❌ Use-cases cannot import UI
    ],
    "@repo/adapter-*": [
      "@repo/adapter-*", // ❌ No cross-adapter dependencies
      "@repo/ui", // ❌ Adapters cannot import UI
    ],
    // ... more restrictions
  },
};
```

ESLint will enforce these rules at compile-time.

## Adding a New Adapter

### Adding an Outbound Adapter (e.g., Prisma database)

1. Create new package:

```bash
mkdir packages/adapter-prisma
```

2. Update `hexagonal.config.js` (no changes needed - wildcard pattern `@repo/adapter-*`)

3. Import in composition root:

```typescript
// apps/app-next/src/di/container.ts
import { PrismaUserRepository } from "@repo/adapter-prisma";

export const container = {
  userRepository: new PrismaUserRepository(),
};
```

4. ESLint prevents imports outside `src/di/` ✅

### Adding an Inbound Adapter (e.g., CLI commands)

1. Create new package:

```bash
mkdir packages/adapter-cli
```

2. Add your CLI command classes that dispatch domain commands:

```typescript
// packages/adapter-cli/src/create-task.command.ts
export class CreateTaskCLICommand {
  constructor(private commandBus: CommandBus) {}

  async execute(args: string[]) {
    await this.commandBus.dispatch(new CreateTaskCommand({ title: args[0] }));
  }
}
```

3. Wire it up in your app's entry point (same DI rules apply)

## Why Hexagonal Architecture?

### Without Hexagonal

```typescript
// ❌ Tightly coupled to Prisma
import { prisma } from '@/lib/prisma';

export default function UserPage() {
  const users = await prisma.user.findMany();
  return <div>{users.map(...)}</div>;
}
```

### With Hexagonal

```typescript
// ✅ Decoupled - swap Prisma for anything
import { container } from '@/di/container';

export default function UserPage() {
  const users = await container.userRepository.findAll();
  return <div>{users.map(...)}</div>;
}
```

## Key Benefits

1. **Flexibility** - Swap databases, APIs, state management without touching business logic
2. **Testability** - Test business logic without mocking frameworks
3. **Scalability** - Clear boundaries prevent spaghetti code
4. **Team Velocity** - Architecture enforced automatically, not via code reviews
5. **AI-Friendly** - AI can't accidentally violate architecture (ESLint catches it)

## License

MIT

## Learn More

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [use-less-react](https://github.com/fabfog/use-less-react)
- [Turborepo](https://turbo.build/repo)
