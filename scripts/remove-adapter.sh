#!/bin/bash

# Script to remove an adapter package from the monorepo
# Usage: pnpm remove:adapter <adapter-name>

set -e

ADAPTER_NAME=$1

if [ -z "$ADAPTER_NAME" ]; then
  echo "❌ Error: Please provide an adapter name"
  echo "Usage: pnpm remove:adapter <adapter-name>"
  echo "Example: pnpm remove:adapter adapter-demo"
  exit 1
fi

# Add @repo/ prefix if not present
if [[ ! "$ADAPTER_NAME" =~ ^@repo/ ]]; then
  FULL_NAME="@repo/$ADAPTER_NAME"
else
  FULL_NAME="$ADAPTER_NAME"
  ADAPTER_NAME=${ADAPTER_NAME#@repo/}
fi

ADAPTER_PATH="packages/$ADAPTER_NAME"

echo "🗑️  Removing adapter package: $FULL_NAME"
echo ""

# Check if package exists
if [ ! -d "$ADAPTER_PATH" ]; then
  echo "❌ Error: Package not found at $ADAPTER_PATH"
  exit 1
fi

# Remove from transpilePackages in all Next.js configs
echo "  ✓ Removing from Next.js transpilePackages..."
find apps -name "next.config.js" -type f 2>/dev/null | while read -r config_file; do
  if [ -f "$config_file" ]; then
    # Escape forward slashes in package name for sed
    ESCAPED_NAME=$(echo "$FULL_NAME" | sed 's/\//\\\//g')
    sed -i '' "/\"$ESCAPED_NAME\",/d" "$config_file"
  fi
done

# Remove the package directory
echo "  ✓ Removing package directory: $ADAPTER_PATH"
rm -rf "$ADAPTER_PATH"

# Remove from pnpm workspace (if defined in pnpm-workspace.yaml)
if [ -f "pnpm-workspace.yaml" ]; then
  echo "  ✓ Package removed (pnpm workspace auto-detects packages)"
fi

echo ""
echo "✅ Adapter package removed successfully!"
echo ""

# Check for remaining references in code
echo "🔍 Checking for remaining references in code..."
REMAINING_REFS=$(grep -r "$FULL_NAME" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" apps packages 2>/dev/null || true)

if [ -n "$REMAINING_REFS" ]; then
  echo "⚠️  Warning: Found remaining references to $FULL_NAME:"
  echo ""
  echo "$REMAINING_REFS"
  echo ""
  echo "Please review and remove these references manually."
  echo ""
fi

# Check for remaining references in index files
echo "🔍 Checking for references in index files..."
INDEX_REFS=$(grep -r "$(echo $ADAPTER_NAME | sed 's/adapter-//')" --include="index.ts" packages 2>/dev/null || true)

if [ -n "$INDEX_REFS" ]; then
  echo "⚠️  Warning: Potential references found in index files:"
  echo ""
  echo "$INDEX_REFS"
  echo ""
  echo "Please verify and clean these files if needed."
  echo ""
fi

echo "Next steps:"
echo "  1. Run: pnpm install"
echo "  2. Remove any remaining imports of $FULL_NAME from your code (see warnings above)"
echo "  3. Clean any index.ts files that may still reference the adapter"
echo "  4. Run: pnpm build"
echo ""
