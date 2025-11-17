import type { PlopTypes } from "@turbo/gen";

export function entityGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("entity", {
    description: "Create a new domain entity",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Entity name (e.g., User, Product):",
      },
      {
        type: "input",
        name: "module",
        message: "Module name (e.g., auth, shop):",
        default: "demo",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/domain/src/{{kebabCase module}}/{{kebabCase name}}.entity.ts",
        templateFile: "templates/entity.hbs",
      },
      {
        type: "add",
        path: "packages/domain/src/{{kebabCase module}}/index.ts",
        template: "",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "packages/domain/src/{{kebabCase module}}/index.ts",
        template: 'export * from "./{{kebabCase name}}.entity";',
      },
      // Export module in main index
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
    ],
  });
}
