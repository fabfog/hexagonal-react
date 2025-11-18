#!/bin/bash

# Script to remove all demo/task-manager code from the project
# Usage: pnpm remove:demo

set -e

echo "🧹 Cleaning demo code..."

# Remove demo module from domain
if [ -d "packages/domain/src/demo" ]; then
  echo "  ✓ Removing packages/domain/src/demo/"
  rm -rf packages/domain/src/demo
fi

# Remove demo module from use-cases
if [ -d "packages/use-cases/src/demo" ]; then
  echo "  ✓ Removing packages/use-cases/src/demo/"
  rm -rf packages/use-cases/src/demo
fi

# Remove demo module from ports
if [ -d "packages/ports/src/demo" ]; then
  echo "  ✓ Removing packages/ports/src/demo/"
  rm -rf packages/ports/src/demo
fi

# Remove entire adapter-demo package
if [ -d "packages/adapter-demo" ]; then
  echo "  ✓ Removing packages/adapter-demo/"
  rm -rf packages/adapter-demo
fi

# Remove demo viewmodels
if [ -f "packages/adapter-viewmodels/src/task-list.viewmodel.ts" ]; then
  echo "  ✓ Removing packages/adapter-viewmodels/src/task-list.viewmodel.ts"
  rm -f packages/adapter-viewmodels/src/task-list.viewmodel.ts
fi

# Remove demo components from app-vite
if [ -f "apps/app-vite/src/components/task-list-container.tsx" ]; then
  echo "  ✓ Removing apps/app-vite/src/components/task-list-container.tsx"
  rm -f apps/app-vite/src/components/task-list-container.tsx
fi
if [ -f "apps/app-vite/src/components/task-list.tsx" ]; then
  echo "  ✓ Removing apps/app-vite/src/components/task-list.tsx"
  rm -f apps/app-vite/src/components/task-list.tsx
fi

# Remove demo components from app-next
if [ -f "apps/app-next/src/components/task-list-container.tsx" ]; then
  echo "  ✓ Removing apps/app-next/src/components/task-list-container.tsx"
  rm -f apps/app-next/src/components/task-list-container.tsx
fi
if [ -f "apps/app-next/src/components/task-list.tsx" ]; then
  echo "  ✓ Removing apps/app-next/src/components/task-list.tsx"
  rm -f apps/app-next/src/components/task-list.tsx
fi

# Remove @repo/adapter-demo dependency from app package.json files
echo "  ✓ Removing @repo/adapter-demo from app dependencies..."
find apps -name "package.json" -type f 2>/dev/null | while read -r pkg_file; do
  if [ -f "$pkg_file" ]; then
    sed -i '' '/"@repo\/adapter-demo":/d' "$pkg_file"
  fi
done

# Clean exports from index files
echo "  ✓ Cleaning export statements..."

# Clean domain index
if [ -f "packages/domain/src/index.ts" ]; then
  sed -i '' '/demo/d' packages/domain/src/index.ts
fi

# Clean use-cases index
if [ -f "packages/use-cases/src/index.ts" ]; then
  sed -i '' '/demo/d' packages/use-cases/src/index.ts
fi

# Clean ports index
if [ -f "packages/ports/src/index.ts" ]; then
  sed -i '' '/demo/d' packages/ports/src/index.ts
fi

# Clean adapter-viewmodels index
if [ -f "packages/adapter-viewmodels/src/index.ts" ]; then
  sed -i '' '/task-list/d' packages/adapter-viewmodels/src/index.ts
fi

# Remove @repo/adapter-demo from transpilePackages in all Next.js apps
echo "  ✓ Removing @repo/adapter-demo from Next.js configs..."
find apps -name "next.config.js" -type f 2>/dev/null | while read -r config_file; do
  if [ -f "$config_file" ]; then
    sed -i '' '/"@repo\/adapter-demo",/d' "$config_file"
  fi
done

# Reset DI container for app-vite
cat > apps/app-vite/src/di/container.ts << 'EOF'
import { CommandBus, EventBus, HybridCommandBus, QueryBus } from "@dxbox/use-less-react/classes";

/**
 * Dependency Injection Container
 *
 * This is where we wire up our hexagonal architecture:
 * - Instantiate repositories (adapters)
 * - Create use-case handlers
 * - Register handlers with command/query buses
 * - Create ViewModels with their dependencies
 */

// Create buses
export const commandBus = new HybridCommandBus(new CommandBus(), new CommandBus());
export const queryBus = new QueryBus();
export const eventBus = new EventBus();

/**
 * TODO: Register your handlers here
 *
 * Example:
 * import { CreateUserHandler } from "@repo/use-cases";
 * import { InMemoryUserRepository } from "@repo/adapter-demo";
 *
 * const userRepository = new InMemoryUserRepository();
 * const createUserHandler = new CreateUserHandler(userRepository, eventBus);
 * commandBus.registerLocalHandler(CreateUserCommand.prototype.type, createUserHandler);
 */
EOF

# Reset DI container for app-next
cat > apps/app-next/src/di/container.ts << 'EOF'
import { CommandBus, EventBus, HybridCommandBus, QueryBus } from "@dxbox/use-less-react/classes";

/**
 * Dependency Injection Container
 *
 * This is where we wire up our hexagonal architecture:
 * - Instantiate repositories (adapters)
 * - Create use-case handlers
 * - Register handlers with command/query buses
 * - Create ViewModels with their dependencies
 */

// Create buses
export const commandBus = new HybridCommandBus(new CommandBus(), new CommandBus());
export const queryBus = new QueryBus();
export const eventBus = new EventBus();

/**
 * TODO: Register your handlers here
 *
 * Example:
 * import { CreateUserHandler } from "@repo/use-cases";
 * import { InMemoryUserRepository } from "@repo/adapter-demo";
 *
 * const userRepository = new InMemoryUserRepository();
 * const createUserHandler = new CreateUserHandler(userRepository, eventBus);
 * commandBus.registerLocalHandler(CreateUserCommand.prototype.type, createUserHandler);
 */
EOF

# Reset app-vite home page
cat > apps/app-vite/src/App.tsx << 'EOF'

export default function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Vite App</h1>
          <p className="text-xl text-gray-700 mb-8">
            Monorepo template enforcing hexagonal architecture via ESLint + Turborepo
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Core Mantra</h2>
            <p className="text-lg text-indigo-600 font-medium italic">
              &ldquo;If it compiles, it&rsquo;s architecturally correct&rdquo;
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">D</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Domain</h3>
              <p className="text-gray-600">Entities, commands, queries & events</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">P</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ports</h3>
              <p className="text-gray-600">Interfaces and contracts</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">UC</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Use Cases</h3>
              <p className="text-gray-600">Application logic & orchestration</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adapters</h3>
              <p className="text-gray-600">Concrete implementations - swappable</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-amber-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">UI</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">UI</h3>
              <p className="text-gray-600">ViewModels (PubSub) + React components</p>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Composition Root</h3>
            <p className="text-yellow-800">
              Adapters can only be imported in{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded">apps/*/src/di/**</code>
              <br />
              This enforces proper dependency injection.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
EOF

# Reset app-next home page
cat > apps/app-next/src/app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Next App</h1>
          <p className="text-xl text-gray-700 mb-8">
            Monorepo template enforcing hexagonal architecture via ESLint + Turborepo
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Core Mantra</h2>
            <p className="text-lg text-indigo-600 font-medium italic">
              &ldquo;If it compiles, it&rsquo;s architecturally correct&rdquo;
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">D</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Domain</h3>
              <p className="text-gray-600">Entities, commands, queries & events</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">P</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ports</h3>
              <p className="text-gray-600">Interfaces and contracts</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-cyan-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">UC</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Use Cases</h3>
              <p className="text-gray-600">Application logic & orchestration</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adapters</h3>
              <p className="text-gray-600">Concrete implementations - swappable</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-amber-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">UI</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">UI</h3>
              <p className="text-gray-600">ViewModels (PubSub) + React components</p>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Composition Root</h3>
            <p className="text-yellow-800">
              Adapters can only be imported in{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded">apps/*/src/di/**</code>
              <br />
              This enforces proper dependency injection.
            </p>
          </div>

          <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-400 p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Running the Apps</h3>
            <div className="text-indigo-800 space-y-2">
              <p>
                <code className="bg-indigo-100 px-2 py-1 rounded">pnpm dev</code> - Runs all apps in
                parallel
              </p>
              <p className="text-sm text-indigo-600">
                • Next app: http://localhost:3001
                <br />• Vite app: http://localhost:3002
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
EOF

echo ""
echo "✅ Demo code removed successfully!"
echo ""

# Update pnpm lockfile
echo "📦 Updating pnpm-lock.yaml..."
pnpm install --lockfile-only 2>/dev/null || echo "  ⚠️  Please run 'pnpm install' manually to update lockfile"
echo ""

# Remove this script from package.json
echo "🗑️  Removing cleanup script from package.json..."
if [ -f "package.json" ]; then
  sed -i '' '/"remove:demo":/d' package.json
fi

# Remove script files
echo "🗑️  Removing cleanup script files..."
rm -f scripts/remove-demo.sh
rm -f scripts/README.md

# Remove scripts directory if empty
if [ -d "scripts" ] && [ -z "$(ls -A scripts)" ]; then
  rmdir scripts
  echo "  ✓ Removed empty scripts directory"
fi

echo ""
echo "Next steps:"
echo "Start creating your own features with: pnpm gen"
echo ""
