import type { PlopTypes } from "@turbo/gen";

export function portGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("port", {
    description: "Create a new port interface",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Port interface name (e.g., IEmailService, IPaymentGateway):",
      },
      {
        type: "input",
        name: "module",
        message: "Module name:",
        default: "demo",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/ports/src/{{kebabCase module}}/{{kebabCase name}}.interface.ts",
        templateFile: "templates/port.hbs",
      },
      {
        type: "add",
        path: "packages/ports/src/{{kebabCase module}}/index.ts",
        template: "",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "packages/ports/src/{{kebabCase module}}/index.ts",
        template: 'export * from "./{{kebabCase name}}.interface";',
      },
      // Export module in main index
      {
        type: "add",
        path: "packages/ports/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "packages/ports/src/index.ts",
        template: 'export * from "./{{kebabCase module}}";',
      },
    ],
  });
}
