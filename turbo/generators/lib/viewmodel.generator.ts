import type { PlopTypes } from "@turbo/gen";
import { join } from "path";
import { kebabCase, appendIfNotExists } from "./helpers";

export function viewmodelGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("viewmodel", {
    description: "Create a new ViewModel",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "ViewModel name (e.g., UserList, ProductDetail):",
      },
      {
        type: "input",
        name: "module",
        message: "Module name:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/adapter-viewmodels/src/{{kebabCase module}}/{{kebabCase name}}.viewmodel.ts",
        templateFile: "templates/viewmodel.hbs",
      },
      {
        type: "add",
        path: "packages/adapter-viewmodels/src/{{kebabCase module}}/{{kebabCase name}}.viewmodel.test.ts",
        templateFile: "templates/viewmodel-test.hbs",
      },
      // Create module index if it doesn't exist
      {
        type: "add",
        path: "packages/adapter-viewmodels/src/{{kebabCase module}}/index.ts",
        template: "",
        skipIfExists: true,
      },
      // Update module exports
      function (answers) {
        const module = kebabCase((answers as any).module);
        const name = kebabCase((answers as any).name);
        const modulePath = join(process.cwd(), "packages/adapter-viewmodels/src", module, "index.ts");
        return appendIfNotExists(modulePath, `export * from "./${name}.viewmodel";`);
      },
      // Export module in main index
      {
        type: "add",
        path: "packages/adapter-viewmodels/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      function (answers) {
        const module = kebabCase((answers as any).module);
        const indexPath = join(process.cwd(), "packages/adapter-viewmodels/src/index.ts");
        return appendIfNotExists(indexPath, `export * from "./${module}";`);
      },
    ],
  });
}
