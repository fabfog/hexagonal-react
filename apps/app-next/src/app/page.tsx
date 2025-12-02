"use client";

import { TaskListContainer } from "@/components/task-list-container";
import "@/di/demo"; // Initialize demo module (registers handlers)

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
              <p className="text-gray-600">ViewModels (ReactiveStore) + React components</p>
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

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Demo: Task Manager</h2>
            <p className="text-gray-700 mb-6">
              This demonstrates the Container/Presentational pattern with ViewModels:
            </p>
            <TaskListContainer />
          </div>
        </div>
      </div>
    </main>
  );
}
