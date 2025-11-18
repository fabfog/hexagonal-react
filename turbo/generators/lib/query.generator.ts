import type { PlopTypes } from "@turbo/gen";
import { join } from "path";
import { kebabCase, appendIfNotExists } from "./helpers";

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
      function (answers) {
        const module = kebabCase((answers as any).module);
        const name = kebabCase((answers as any).name);
        const modulePath = join(process.cwd(), "packages/domain/src", module, "index.ts");
        return appendIfNotExists(modulePath, `export * from "./${name}.query";`);
      },
      function (answers) {
        const module = kebabCase((answers as any).module);
        const name = kebabCase((answers as any).name);
        const modulePath = join(process.cwd(), "packages/use-cases/src", module, "index.ts");
        return appendIfNotExists(modulePath, `export * from "./${name}.handler";`);
      },
      // Export modules in main indexes
      {
        type: "add",
        path: "packages/domain/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      function (answers) {
        const module = kebabCase((answers as any).module);
        const indexPath = join(process.cwd(), "packages/domain/src/index.ts");
        return appendIfNotExists(indexPath, `export * from "./${module}";`);
      },
      {
        type: "add",
        path: "packages/use-cases/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      function (answers) {
        const module = kebabCase((answers as any).module);
        const indexPath = join(process.cwd(), "packages/use-cases/src/index.ts");
        return appendIfNotExists(indexPath, `export * from "./${module}";`);
      },
    ],
  });
}
