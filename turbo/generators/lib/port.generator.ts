import type { PlopTypes } from "@turbo/gen";
import { join } from "path";
import { kebabCase, appendIfNotExists } from "./helpers";

export function portGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("port", {
    description: "Create a new port interface",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Port interface name (e.g., EmailServiceInterface, PaymentGatewayInterface):",
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
        path: "packages/ports/src/{{kebabCase module}}/{{kebabCase name}}.interface.ts",
        templateFile: "templates/port.hbs",
      },
      {
        type: "add",
        path: "packages/ports/src/{{kebabCase module}}/index.ts",
        template: "",
        skipIfExists: true,
      },
      function (answers) {
        const module = kebabCase((answers as any).module);
        const name = kebabCase((answers as any).name);
        const modulePath = join(process.cwd(), "packages/ports/src", module, "index.ts");
        return appendIfNotExists(modulePath, `export * from "./${name}.interface";`);
      },
      // Export module in main index
      {
        type: "add",
        path: "packages/ports/src/index.ts",
        template: "",
        skipIfExists: true,
      },
      function (answers) {
        const module = kebabCase((answers as any).module);
        const indexPath = join(process.cwd(), "packages/ports/src/index.ts");
        return appendIfNotExists(indexPath, `export * from "./${module}";`);
      },
    ],
  });
}
