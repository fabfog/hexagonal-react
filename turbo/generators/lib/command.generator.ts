import type { PlopTypes } from "@turbo/gen";

export function commandGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("command", {
    description: "Create a new command with handler and event",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Command name (e.g., CreateUser, UpdateProduct):",
      },
      {
        type: "input",
        name: "module",
        message: "Module name:",
        default: "demo",
      },
    ],
    actions: [
      // Command
      {
        type: "add",
        path: "packages/domain/src/{{kebabCase module}}/{{kebabCase name}}.command.ts",
        templateFile: "templates/command.hbs",
      },
      // Event
      {
        type: "add",
        path: "packages/domain/src/{{kebabCase module}}/{{kebabCase name}}.event.ts",
        templateFile: "templates/event.hbs",
      },
      // Handler
      {
        type: "add",
        path: "packages/use-cases/src/{{kebabCase module}}/{{kebabCase name}}.handler.ts",
        templateFile: "templates/command-handler.hbs",
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
        template:
          'export * from "./{{kebabCase name}}.command";\nexport * from "./{{kebabCase name}}.event";',
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
