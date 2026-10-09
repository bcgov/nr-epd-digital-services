#!/usr/bin/env bash
# Build CHEFS Form.io components at the pinned SHA and copy UMD + CSS into
# vendor/chefs-formio. Product Docker / npm run dev never run this.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/vendor/chefs-formio"
VERSION_FILE="$VENDOR/VERSION"
REPO_URL="https://github.com/bcgov/common-hosted-form-service.git"

if [[ ! -f "$VERSION_FILE" ]]; then
  echo "Missing $VERSION_FILE" >&2
  exit 1
fi

SHA="$(grep -E '^SHA=' "$VERSION_FILE" | cut -d= -f2)"
if [[ -z "$SHA" ]]; then
  echo "VERSION file has no SHA=" >&2
  exit 1
fi

WORKDIR="$(mktemp -d "${TMPDIR:-/tmp}/chefs-formio.XXXXXX")"
cleanup() {
  rm -rf "$WORKDIR"
}
trap cleanup EXIT

echo "Cloning CHEFS components at $SHA..."
git clone --filter=blob:none --sparse --no-checkout "$REPO_URL" "$WORKDIR"
git -C "$WORKDIR" sparse-checkout set components LICENSE
git -C "$WORKDIR" fetch --depth 1 origin "$SHA"
git -C "$WORKDIR" checkout --detach "$SHA"

echo "Building @bcgov/formio..."
cd "$WORKDIR/components"
npm ci
npm run build

mkdir -p "$VENDOR"
cp -f "$WORKDIR/components/dist/bcgov-formio-components.use.min.js" "$VENDOR/"
cp -f "$WORKDIR/components/dist/chefs-form-viewer.css" "$VENDOR/"
cp -f "$WORKDIR/components/dist/bcgov-formio-components.css" "$VENDOR/"
# Leaflet images webpack emits next to the UMD; keep them beside the JS so
# relative asset URLs resolve when the file is loaded as a classic script.
find "$WORKDIR/components/dist" -maxdepth 1 \( -name '*.png' -o -name '*.svg' \) \
  -exec cp -f {} "$VENDOR/" \;
if [[ -f "$WORKDIR/LICENSE" ]]; then
  cp -f "$WORKDIR/LICENSE" "$VENDOR/LICENSE"
else
  curl -fsSL "https://raw.githubusercontent.com/bcgov/common-hosted-form-service/${SHA}/LICENSE" \
    -o "$VENDOR/LICENSE"
fi

echo "Vendored CHEFS Form.io plugin to $VENDOR"
ls -lh "$VENDOR"
