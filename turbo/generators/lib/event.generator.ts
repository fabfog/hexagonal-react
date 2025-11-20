import type { PlopTypes } from "@turbo/gen";
import { join } from "path";
import { kebabCase, appendIfNotExists } from "./helpers";

export function eventGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("event", {
    description: "Create a new domain event",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Event name (e.g., UserCreated, ProductUpdated):",
      },
      {
        type: "input",
        name: "module",
        message: "Module name:",
      },
    ],
    actions: [
      // Event
      {
        type: "add",
        path: "packages/domain/src/{{kebabCase module}}/{{kebabCase name}}.event.ts",
        templateFile: "templates/event.hbs",
      },
      // Create index file if it doesn't exist
      {
        type: "add",
        path: "packages/domain/src/{{kebabCase module}}/index.ts",
        template: "",
        skipIfExists: true,
      },
      // Update exports
      function (answers) {
        const module = kebabCase((answers as any).module);
        const name = kebabCase((answers as any).name);
        const modulePath = join(process.cwd(), "packages/domain/src", module, "index.ts");
        return appendIfNotExists(modulePath, `export * from "./${name}.event";`);
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
