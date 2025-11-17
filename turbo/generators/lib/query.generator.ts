import type { PlopTypes } from "@turbo/gen";

export function queryGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("query", {
    description: "Create a new query with handler",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Query name (e.g., GetUser, ListProducts):",
      },
      {
        type: "input",
        name: "module",
        message: "Module name:",
        default: "demo",
      },
    ],
    actions: [
      // Query
      {
        type: "add",
        path: "packages/domain/src/{{kebabCase module}}/{{kebabCase name}}.query.ts",
        templateFile: "templates/query.hbs",
      },
      // Handler
      {
        type: "add",
        path: "packages/use-cases/src/{{kebabCase module}}/{{kebabCase name}}.handler.ts",
        templateFile: "templates/query-handler.hbs",
      },
      // Create index files if they don't exist
      {
        type: "add",
        path: "packages/domain/src/{{kebabCase module}}/index.ts",
        template: "",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "packages/use-cases/src/{{kebabCase module}}/index.ts",
        template: "",
        skipIfExists: true,
      },
      // Update exports
      {
        type: "append",
        path: "packages/domain/src/{{kebabCase module}}/index.ts",
        template: 'export * from "./{{kebabCase name}}.query";',
      },
      {
        type: "append",
        path: "packages/use-cases/src/{{kebabCase module}}/index.ts",
        template: 'export * from "./{{kebabCase name}}.handler";',
      },
      // Export modules in main indexes
      {
        type: "add",
        path: "packages/domain/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "packages/domain/src/index.ts",
        template: 'export * from "./{{kebabCase module}}";',
      },
      {
        type: "add",
        path: "packages/use-cases/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "packages/use-cases/src/index.ts",
        template: 'export * from "./{{kebabCase module}}";',
      },
    ],
  });
}
