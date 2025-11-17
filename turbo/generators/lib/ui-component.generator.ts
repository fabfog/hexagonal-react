import type { PlopTypes } from "@turbo/gen";

export function uiComponentGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("ui-component", {
    description: "Create a new UI component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (e.g., Button, Modal, UserCard):",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/ui/src/{{kebabCase name}}/{{kebabCase name}}.tsx",
        templateFile: "templates/ui-component.hbs",
      },
      {
        type: "add",
        path: "packages/ui/src/{{kebabCase name}}/index.ts",
        template: 'export * from "./{{kebabCase name}}";',
      },
      {
        type: "add",
        path: "packages/ui/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "packages/ui/src/index.ts",
        template: 'export * from "./{{kebabCase name}}";',
      },
    ],
  });
}
