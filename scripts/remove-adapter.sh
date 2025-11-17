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
    sed -i '' "/\"$FULL_NAME\",/d" "$config_file"
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
echo "Next steps:"
echo "  1. Run: pnpm install"
echo "  2. Remove any imports of $FULL_NAME from your code"
echo "  3. Run: pnpm build"
echo ""
