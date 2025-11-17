import type { PlopTypes } from "@turbo/gen";
import { pascalCase, camelCase, kebabCase } from "./lib/helpers";
import { entityGenerator } from "./lib/entity.generator";
import { commandGenerator } from "./lib/command.generator";
import { queryGenerator } from "./lib/query.generator";
import { portGenerator } from "./lib/port.generator";
import { repositoryGenerator } from "./lib/repository.generator";
import { viewmodelGenerator } from "./lib/viewmodel.generator";
import { uiComponentGenerator } from "./lib/ui-component.generator";
import { adapterGenerator } from "./lib/adapter.generator";

/**
 * Turbo Generators Configuration
 *
 * Code generators for hexagonal architecture components.
 * Run with: pnpm gen <generator-name>
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Register helper functions
  plop.setHelper("pascalCase", pascalCase);
  plop.setHelper("camelCase", camelCase);
  plop.setHelper("kebabCase", kebabCase);

  // Register all generators
  entityGenerator(plop);
  commandGenerator(plop);
  queryGenerator(plop);
  portGenerator(plop);
  repositoryGenerator(plop);
  adapterGenerator(plop);
  viewmodelGenerator(plop);
  uiComponentGenerator(plop);
}
