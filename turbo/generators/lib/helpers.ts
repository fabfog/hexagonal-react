/**
 * Helper functions for Turbo generators
 */

export function pascalCase(text: string): string {
  return text
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function camelCase(text: string): string {
  const pascal = text
    .split(/[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function kebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
