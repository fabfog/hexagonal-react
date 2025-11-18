# Code Generators

Automated code generators for hexagonal architecture components.

## Usage

Run generators with:

```bash
pnpm gen
```

This will show an interactive menu of all available generators.

Or run a specific generator directly:

```bash
pnpm gen <generator-name>
```

## Available Generators

### 1. Entity
Creates a new domain entity with CRUD data types.

```bash
pnpm gen entity
```

**Prompts:**
- Entity name (e.g., User, Product)
- Module name (e.g., auth, shop)

**Generates:**
- `packages/domain/src/<module>/<entity>.entity.ts`
- Updates `packages/domain/src/<module>/index.ts`

### 2. Command
Creates a complete command flow: Command + Handler + Event.

```bash
pnpm gen command
```

**Prompts:**
- Command name (e.g., CreateUser, UpdateProduct)
- Module name

**Generates:**
- `packages/domain/src/<module>/<name>.command.ts`
- `packages/domain/src/<module>/<name>ed.event.ts`
- `packages/use-cases/src/<module>/<name>.handler.ts`
- Updates both index files

**Remember to:**
- Register the handler in DI container (`apps/*/src/di/container.ts`)
- Add event listeners if needed

### 3. Query
Creates a query with its handler.

```bash
pnpm gen query
```

**Prompts:**
- Query name (e.g., GetUser, ListProducts)
- Module name

**Generates:**
- `packages/domain/src/<module>/<name>.query.ts`
- `packages/use-cases/src/<module>/<name>.handler.ts`
- Updates both index files

**Remember to:**
- Register the handler in DI container

### 4. Port
Creates a generic port interface.

```bash
pnpm gen port
```

**Prompts:**
- Port interface name (e.g., IEmailService, IPaymentGateway)
- Module name

**Generates:**
- `packages/ports/src/<module>/<name>.interface.ts`
- Updates `packages/ports/src/<module>/index.ts`

### 5. ViewModel
Creates a reactive ViewModel for UI state management.

```bash
pnpm gen viewmodel
```

**Prompts:**
- ViewModel name (e.g., UserList, ProductDetail)

**Generates:**
- `packages/adapter-viewmodels/src/<name>.viewmodel.ts`
- Updates `packages/adapter-viewmodels/src/index.ts`

**Remember to:**
- Instantiate in DI container
- Create container component in apps to use it

### 6. Adapter
Creates an adapter package.

```bash
pnpm gen adapter
```

**Prompts:**
- Adapter package name (e.g., "postgres")

**Generates:**
- `packages/adapter-<name>` with basic adapter package file structure

### 7. UI Component
Creates a pure presentational React component.

```bash
pnpm gen ui-component
```

**Prompts:**
- Component name (e.g., Button, Modal, UserCard)
- Component type (atomic, molecule, organism)

**Generates:**
- `packages/ui/src/<name>/<name>.tsx`
- `packages/ui/src/<name>/index.ts`
- Updates `packages/ui/src/index.ts`

## Examples

### Example 1: Create a new feature for Users

```bash
# 1. Create the entity
pnpm gen entity
# Name: User
# Module: users

# 2. Create repository
pnpm gen repository
# Entity: User
# Module: users

# 3. Create commands
pnpm gen command
# Name: CreateUser
# Module: users

pnpm gen command
# Name: UpdateUser
# Module: users

# 4. Create queries
pnpm gen query
# Name: GetUser
# Module: users

pnpm gen query
# Name: ListUsers
# Module: users

# 5. Create ViewModel
pnpm gen viewmodel
# Name: UserList

# 6. Create UI components
pnpm gen ui-component
# Name: UserCard
# Type: atomic
```

### Example 2: Add a new port/adapter

```bash
# Create the port interface
pnpm gen port
# Name: IEmailService
# Module: notifications

# Then manually create the adapter implementation in:
# packages/adapter-<name>/src/email-service.ts
```

## Post-Generation Steps

After generating code, you typically need to:

1. **Fill in TODOs** - All generated files have TODO comments
2. **Register in DI** - Add handlers/repositories to `apps/*/src/di/container.ts`
3. **Update types** - Complete interfaces and payload types
4. **Add tests** - Create test files for your components
5. **Type-check** - Run `pnpm type-check` to verify everything compiles

## Tips

- Use **kebab-case** for file names (generators handle this automatically)
- Use **PascalCase** for entity/component names
- Keep modules organized (auth, users, products, etc.)
- **Always create entities first**, then repositories, then commands/queries
- The repository generator will validate that the entity exists before proceeding
