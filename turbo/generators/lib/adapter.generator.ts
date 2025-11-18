import type { PlopTypes } from "@turbo/gen";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export function adapterGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("adapter", {
    description: "Create a new adapter package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Adapter name (e.g., postgres, redis, api):",
      },
    ],
    actions: [
      // Create package directory and files
      {
        type: "add",
        path: "packages/adapter-{{kebabCase name}}/package.json",
        template: `{
  "name": "@repo/adapter-{{kebabCase name}}",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "@repo/domain": "workspace:*",
    "@repo/ports": "workspace:*"
  },
  "devDependencies": {
    "@repo/config-typescript": "workspace:*",
    "typescript": "^5.3.3"
  }
}`,
      },
      {
        type: "add",
        path: "packages/adapter-{{kebabCase name}}/tsconfig.json",
        template: `{
  "extends": "@repo/config-typescript/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
      },
      {
        type: "add",
        path: "packages/adapter-{{kebabCase name}}/src/index.ts",
        template: `// Export your {{kebabCase name}} adapters here
`,
      },
      {
        type: "add",
        path: "packages/adapter-{{kebabCase name}}/README.md",
        template: `# @repo/adapter-{{kebabCase name}}

{{pascalCase name}} adapter implementations for the hexagonal architecture.

## Usage

This package contains adapter implementations that integrate with {{pascalCase name}}.

Add your adapter implementations in the \`src/\` directory and export them from \`index.ts\`.
`,
      },
      // Add to transpilePackages in all Next.js configs
      function addToTranspilePackages(answers) {
        const adapterName = `@repo/adapter-${(answers as any).name
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/[\s_]+/g, "-")
          .toLowerCase()}`;

        const appsDir = join(process.cwd(), "apps");
        const apps = readdirSync(appsDir, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        let updatedCount = 0;

        for (const app of apps) {
          const configPath = join(appsDir, app, "next.config.js");
          try {
            const configContent = readFileSync(configPath, "utf-8");

            // Check if already exists
            if (configContent.includes(adapterName)) {
              continue;
            }

            // Add to transpilePackages array
            const updated = configContent.replace(
              /(transpilePackages:\s*\[)/,
              `$1\n    "${adapterName}",`
            );

            writeFileSync(configPath, updated, "utf-8");
            updatedCount++;
          } catch (error) {
            // File doesn't exist or isn't a Next.js app, skip
          }
        }

        if (updatedCount > 0) {
          return `✓ Added ${adapterName} to transpilePackages in ${updatedCount} Next.js app(s)`;
        }
        return `✓ Adapter package created (no Next.js apps found)`;
      },
    ],
  });
}
