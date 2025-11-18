import type { PlopTypes } from "@turbo/gen";
import { join } from "path";
import { kebabCase, appendIfNotExists } from "./helpers";

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
      function (answers) {
        const module = kebabCase((answers as any).module);
        const name = kebabCase((answers as any).name);
        const modulePath = join(process.cwd(), "packages/domain/src", module, "index.ts");
        return appendIfNotExists(modulePath, `export * from "./${name}.entity";`);
      },
      // Export module in main index
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
    ],
  });
}
