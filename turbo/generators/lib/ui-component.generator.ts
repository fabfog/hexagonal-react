import type { PlopTypes } from "@turbo/gen";
import { join } from "path";
import { kebabCase, appendIfNotExists } from "./helpers";

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
      function (answers) {
        const name = kebabCase((answers as any).name);
        const indexPath = join(process.cwd(), "packages/ui/src/index.ts");
        return appendIfNotExists(indexPath, `export * from "./${name}";`);
      },
    ],
  });
}
