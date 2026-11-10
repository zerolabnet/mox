#!/bin/sh
# Apply mox-webmail-theme patches to a mox source tree.
# Run from the mox repository root (directory containing webmail/, Makefile, etc.).

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PATCH_DIR="$SCRIPT_DIR/patches"

if [ ! -d webmail ]; then
	echo "Error: run this script from the mox repository root (expected ./webmail)." >&2
	exit 1
fi

if [ ! -f Makefile ]; then
	echo "Warning: Makefile not found; are you in the mox repo root?" >&2
fi

MODE=${1:-check}
PATCH=${2:-all-in-one}

copy_assets() {
	echo "==> copy fonts (woff2, not in patch)"
	rm -rf webmail/fonts
	mkdir -p webmail/fonts
	cp "$SCRIPT_DIR/overlay/webmail/fonts/"*.woff2 webmail/fonts/
}

apply_one() {
	file=$1
	echo "==> $file"
	if [ "$MODE" = check ]; then
		patch -p0 --dry-run -i "$PATCH_DIR/$file" || return 1
	elif [ "$MODE" = apply ]; then
		patch -p0 -i "$PATCH_DIR/$file"
	else
		echo "Usage: $0 [check|apply] [all-in-one|lib.ts|webmail.ts|webmail.html|msg.html|text.html|webmail.go|fonts.css|favicon.svg|compose.go|compose_test.go]" >&2
		exit 1
	fi
}

case "$PATCH" in
all-in-one)
	apply_one all-in-one.patch
	;;
lib.ts|webmail.ts|webmail.html|msg.html|text.html|webmail.go|fonts.css|favicon.svg|compose.go|compose_test.go)
	apply_one "$PATCH.patch"
	;;
*)
	echo "Unknown patch: $PATCH" >&2
	exit 1
	;;
esac

if [ "$MODE" = apply ]; then
	copy_assets
	echo
	echo "Patches applied. Next steps:"
	echo "  1. make install-frontend   # once, if node_modules missing"
	echo "  2. make frontend           # rebuild webmail/*.js from TypeScript"
	echo "  3. go build ...            # rebuild mox binary"
fi
