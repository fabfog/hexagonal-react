# create-hexagonal-react

A CLI tool to scaffold a new React monorepo with hexagonal architecture.

## Requirements

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (required)

This project uses [pnpm](https://pnpm.io) workspaces and workspace protocol features. The CLI will check if pnpm is installed and provide installation instructions if needed.

## Features

- 🏗️ **Hexagonal Architecture** - Clean separation of concerns with ports & adapters
- 📦 **Monorepo** - Managed with Turborepo and pnpm workspaces
- ⚡ **CQRS** - Command Query Responsibility Segregation pattern
- 🔄 **Event-driven** - Event bus with PubSub pattern
- 🎨 **Tailwind CSS v4** - Latest Tailwind with CSS-based config
- 📝 **TypeScript** - Fully typed
- 🔍 **ESLint** - Enforces architectural boundaries
- 🚀 **Two apps included** - Next.js and Vite

## Usage

### With npx (recommended)

```bash
npx create-hexagonal-react my-app
```

### With npm

```bash
npm create hexagonal-react my-app
```

### With pnpm

```bash
pnpm create hexagonal-react my-app
```

## What You Get

```
my-app/
├── apps/
│   ├── app-next/          # Next.js 15 application
│   └── app-vite/          # Vite + React application
├── packages/
│   ├── domain/            # Entities, Commands, Queries, Events
│   ├── ports/             # Interfaces and contracts
│   ├── use-cases/         # Business logic handlers
│   ├── adapter-demo/      # Infrastructure adapters (repositories, etc.)
│   ├── adapter-viewmodels/# UI adapters (ViewModels)
│   ├── ui/                # Pure presentational components
│   └── config-*/          # Shared configurations
└── package.json
```

## Architecture

This template enforces **hexagonal architecture** (also known as ports & adapters) through:

1. **ESLint rules** - Prevents illegal imports between layers
2. **Package boundaries** - Each layer is a separate package
3. **Dependency inversion** - Core business logic has no dependencies on infrastructure

### Layers

- **Domain** - Pure business entities and DTOs
- **Ports** - Interfaces defining contracts
- **Use Cases** - Application logic (command/query handlers)
- **Adapters** - Implementations (repositories, ViewModels, etc.)
- **UI** - Pure presentational React components
- **Apps** - Composition root with dependency injection

### Core Mantra

> "If it compiles, it's architecturally correct"

The TypeScript compiler and ESLint work together to enforce architectural rules at build time.

## Getting Started

After creating your project:

```bash
cd my-app
pnpm install  # if not installed during creation
pnpm dev
```

Your apps will be running at:
- **Next.js**: http://localhost:3001
- **Vite**: http://localhost:3002

## Demo Feature

The template includes a complete demo feature (Task Manager) that demonstrates:
- CQRS pattern with commands and queries
- Event-driven architecture
- Container/Presentational component pattern
- ViewModel integration with React

### Removing the Demo

You can remove the demo code with a single command:

```bash
pnpm remove:demo
```

This will automatically:
- Remove all demo code from domain, ports, use-cases, and adapters
- Clean up demo components from both apps
- Reset DI containers to minimal setup
- Remove the cleanup script itself

## Documentation

For detailed documentation about the architecture and patterns used, see the [main repository](https://github.com/fabfog/hexagonal-react).

## License

MIT
