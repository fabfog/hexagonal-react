/**
 * Helper functions for Turbo generators
 */

import { readFileSync, writeFileSync, existsSync } from "fs";

export function pascalCase(text: string): string {
  // First convert to kebab-case to handle camelCase input
  const kebab = text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-");

  // Then convert to PascalCase
  return kebab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function camelCase(text: string): string {
  const pascal = pascalCase(text);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function kebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Append a line to a file only if it doesn't already exist
 */
export function appendIfNotExists(filePath: string, line: string): string {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, line + "\n", "utf-8");
    return `✓ Created ${filePath} with: ${line}`;
  }

  const content = readFileSync(filePath, "utf-8");

  // Check if the exact line already exists
  if (content.includes(line)) {
    return `⊘ Already exists in ${filePath}: ${line}`;
  }

  // Append the line
  writeFileSync(filePath, content + line + "\n", "utf-8");
  return `✓ Added to ${filePath}: ${line}`;
}
