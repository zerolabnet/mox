#!/bin/sh
# Build distributable archive: mox-webmail-theme-v0.0.17-theme3.tar.gz
# Run from mox repository root or from mox-webmail-theme/.

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
NAME=mox-webmail-theme
VER=$(grep '^base_version=' "$SCRIPT_DIR/VERSION" | cut -d= -f2)
THEME=$(grep '^theme_version=' "$SCRIPT_DIR/VERSION" | cut -d= -f2)
ARCHIVE="$ROOT/${NAME}-v${VER}-theme${THEME}.tar.gz"

echo "Syncing overlay from webmail/ (if present)..."
if [ -f "$ROOT/webmail/webmail.ts" ]; then
	cp "$ROOT/webmail/lib.ts" "$SCRIPT_DIR/overlay/webmail/lib.ts"
	cp "$ROOT/webmail/webmail.ts" "$SCRIPT_DIR/overlay/webmail/webmail.ts"
	cp "$ROOT/webmail/webmail.html" "$SCRIPT_DIR/overlay/webmail/webmail.html"
	cp "$ROOT/webmail/msg.html" "$SCRIPT_DIR/overlay/webmail/msg.html"
	cp "$ROOT/webmail/text.html" "$SCRIPT_DIR/overlay/webmail/text.html"
	cp "$ROOT/webmail/fonts.css" "$SCRIPT_DIR/overlay/webmail/fonts.css"
	cp "$ROOT/webmail/webmail.go" "$SCRIPT_DIR/overlay/webmail/webmail.go"
	cp "$ROOT/webmail/favicon.svg" "$SCRIPT_DIR/overlay/webmail/favicon.svg"
	rm -rf "$SCRIPT_DIR/overlay/webmail/fonts"
	mkdir -p "$SCRIPT_DIR/overlay/webmail/fonts"
	cp "$ROOT/webmail/fonts/"*.woff2 "$SCRIPT_DIR/overlay/webmail/fonts/"
fi

if [ -f "$ROOT/message/compose.go" ]; then
	mkdir -p "$SCRIPT_DIR/overlay/message"
	cp "$ROOT/message/compose.go" "$SCRIPT_DIR/overlay/message/compose.go"
	if [ -f "$ROOT/message/compose_test.go" ]; then
		cp "$ROOT/message/compose_test.go" "$SCRIPT_DIR/overlay/message/compose_test.go"
	fi
fi

echo "Regenerating patches..."
"$SCRIPT_DIR/regenerate-patches.sh"

echo "Creating $ARCHIVE ..."
tar -czf "$ARCHIVE" -C "$ROOT" \
	--exclude='.DS_Store' \
	"$NAME/README.md" \
	"$NAME/CHANGELOG.md" \
	"$NAME/VERSION" \
	"$NAME/apply.sh" \
	"$NAME/pack.sh" \
	"$NAME/regenerate-patches.sh" \
	"$NAME/patches" \
	"$NAME/overlay" \
	"$NAME/upstream-v0.0.17"

ls -lh "$ARCHIVE"
echo "Done."
