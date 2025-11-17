import type { PlopTypes } from "@turbo/gen";
import { existsSync } from "fs";
import { join } from "path";
import { kebabCase } from "./helpers";

export function repositoryGenerator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("repository", {
    description: "Create a repository (port interface + adapter implementation)",
    prompts: [
      {
        type: "input",
        name: "entity",
        message: "Entity name (e.g., User, Product):",
      },
      {
        type: "input",
        name: "module",
        message: "Module name:",
        default: "demo",
      },
    ],
    actions: [
      // Check if entity exists
      function checkEntityExists(answers) {
        const kebabEntity = kebabCase((answers as any).entity);
        const kebabModule = kebabCase((answers as any).module);

        const entityPath = join(
          process.cwd(),
          "packages",
          "domain",
          "src",
          kebabModule,
          `${kebabEntity}.entity.ts`
        );

        if (!existsSync(entityPath)) {
          throw new Error(
            `Entity file not found: ${entityPath}\n\n` +
            `Please create the entity first with:\n` +
            `  pnpm gen entity\n\n` +
            `Or manually create the file at:\n` +
            `  packages/domain/src/${kebabModule}/${kebabEntity}.entity.ts`
          );
        }

        return `✓ Entity found at packages/domain/src/${kebabModule}/${kebabEntity}.entity.ts`;
      },
      // Port
      {
        type: "add",
        path: "packages/ports/src/{{kebabCase module}}/{{kebabCase entity}}-repository.interface.ts",
        templateFile: "templates/repository-port.hbs",
      },
      // Adapter
      {
        type: "add",
        path: "packages/adapter-demo/src/repositories/in-memory-{{kebabCase entity}}-repository.ts",
        templateFile: "templates/repository-adapter.hbs",
      },
      // Create index file if it doesn't exist
      {
        type: "add",
        path: "packages/ports/src/{{kebabCase module}}/index.ts",
        template: "",
        skipIfExists: true,
      },
      // Update exports
      {
        type: "append",
        path: "packages/ports/src/{{kebabCase module}}/index.ts",
        template: 'export * from "./{{kebabCase entity}}-repository.interface";',
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
