import type { PlopTypes } from "@turbo/gen";

export function viewmodelGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("viewmodel", {
    description: "Create a new ViewModel",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "ViewModel name (e.g., UserList, ProductDetail):",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/adapter-viewmodels/src/{{kebabCase name}}.viewmodel.ts",
        templateFile: "templates/viewmodel.hbs",
      },
      {
        type: "add",
        path: "packages/adapter-viewmodels/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      {
        type: "append",
        path: "packages/adapter-viewmodels/src/index.ts",
        template: 'export * from "./{{kebabCase name}}.viewmodel";',
      },
    ],
  });
}
