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
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Hexagonal React
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Clean Architecture monorepo template with Turborepo
          </p>

          <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-400 mb-6">
              Start building your application using the code generators:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="text-green-400"># Create an entity</div>
                <div>pnpm gen entity</div>
              </div>

              <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="text-green-400"># Create a repository</div>
                <div>pnpm gen repository</div>
              </div>

              <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="text-green-400"># Create a command</div>
                <div>pnpm gen command</div>
              </div>

              <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="text-green-400"># Create a ViewModel</div>
                <div>pnpm gen viewmodel</div>
              </div>
            </div>

            <p className="text-gray-500 mt-6 text-sm">
              See the documentation in the repository for more details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
EOF

# Reset app-next home page
cat > apps/app-next/src/app/page.tsx << 'EOF'
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Hexagonal React
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Clean Architecture monorepo template with Turborepo
          </p>

          <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-400 mb-6">
              Start building your application using the code generators:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="text-green-400"># Create an entity</div>
                <div>pnpm gen entity</div>
              </div>

              <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="text-green-400"># Create a repository</div>
                <div>pnpm gen repository</div>
              </div>

              <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="text-green-400"># Create a command</div>
                <div>pnpm gen command</div>
              </div>

              <div className="bg-gray-900 rounded p-4 font-mono text-sm">
                <div className="text-green-400"># Create a ViewModel</div>
                <div>pnpm gen viewmodel</div>
              </div>
            </div>

            <p className="text-gray-500 mt-6 text-sm">
              See the documentation in the repository for more details.
            </p>
          </div>
        </div>
      </div>
    </div>
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
