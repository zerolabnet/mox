#!/bin/sh
# Regenerate unified diffs from upstream-v0.0.17/ → overlay/
# Run from mox-webmail-theme/ directory.

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
UP="$SCRIPT_DIR/upstream-v0.0.17"
OV="$SCRIPT_DIR/overlay"
OUT="$SCRIPT_DIR/patches"
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/up/webmail" "$STAGE/ov/webmail" "$STAGE/up/message" "$STAGE/ov/message" "$OUT"

cp "$UP/webmail-lib.ts" "$STAGE/up/webmail/lib.ts"
cp "$UP/webmail-webmail.ts" "$STAGE/up/webmail/webmail.ts"
cp "$UP/webmail-webmail.html" "$STAGE/up/webmail/webmail.html"
cp "$UP/webmail-msg.html" "$STAGE/up/webmail/msg.html"
cp "$UP/webmail-text.html" "$STAGE/up/webmail/text.html"
cp "$UP/webmail-webmail.go" "$STAGE/up/webmail/webmail.go"

cp "$OV/webmail/lib.ts" "$STAGE/ov/webmail/lib.ts"
cp "$OV/webmail/webmail.ts" "$STAGE/ov/webmail/webmail.ts"
cp "$OV/webmail/webmail.html" "$STAGE/ov/webmail/webmail.html"
cp "$OV/webmail/msg.html" "$STAGE/ov/webmail/msg.html"
cp "$OV/webmail/text.html" "$STAGE/ov/webmail/text.html"
cp "$OV/webmail/webmail.go" "$STAGE/ov/webmail/webmail.go"
cp "$OV/webmail/fonts.css" "$STAGE/ov/webmail/fonts.css"
cp "$OV/webmail/favicon.svg" "$STAGE/ov/webmail/favicon.svg"

cp "$UP/message-compose.go" "$STAGE/up/message/compose.go"
cp "$OV/message/compose.go" "$STAGE/ov/message/compose.go"
cp "$OV/message/compose_test.go" "$STAGE/ov/message/compose_test.go"

fix_paths() {
	sed -e '1s|^--- .*up/webmail/\(.*\)|--- webmail/\1|' \
		-e '2s|^+++ .*ov/webmail/\(.*\)|+++ webmail/\1|' \
		-e '1s|^--- /dev/null|--- webmail/fonts.css|' \
		-e '2s|^+++ .*fonts\.css.*|+++ webmail/fonts.css|'
}

fix_message_paths() {
	sed -e '1s|^--- .*up/message/\(.*\)|--- message/\1|' \
		-e '2s|^+++ .*ov/message/\(.*\)|+++ message/\1|' \
		-e '1s|^--- /dev/null|--- message/compose_test.go|' \
		-e '2s|^+++ .*compose_test\.go.*|+++ message/compose_test.go|'
}

patch_pair() {
	file=$1
	out=$2
	echo "==> $out"
	diff -u "$STAGE/up/webmail/$file" "$STAGE/ov/webmail/$file" | fix_paths > "$OUT/$out" || true
}

patch_message_pair() {
	file=$1
	out=$2
	echo "==> $out"
	diff -u "$STAGE/up/message/$file" "$STAGE/ov/message/$file" | fix_message_paths > "$OUT/$out" || true
}

patch_pair lib.ts lib.ts.patch
patch_pair webmail.ts webmail.ts.patch
patch_pair webmail.html webmail.html.patch
patch_pair msg.html msg.html.patch
patch_pair text.html text.html.patch
patch_pair webmail.go webmail.go.patch
patch_message_pair compose.go compose.go.patch

echo "==> compose_test.go.patch"
{
	echo "--- /dev/null"
	echo "+++ message/compose_test.go"
	diff -u /dev/null "$STAGE/ov/message/compose_test.go" | tail -n +3
} > "$OUT/compose_test.go.patch" || true

echo "==> favicon.svg.patch"
{
	echo "--- /dev/null"
	echo "+++ webmail/favicon.svg"
	diff -u /dev/null "$STAGE/ov/webmail/favicon.svg" | tail -n +3
} > "$OUT/favicon.svg.patch" || true

echo "==> fonts.css.patch"
{
	echo "--- /dev/null"
	echo "+++ webmail/fonts.css"
	diff -u /dev/null "$STAGE/ov/webmail/fonts.css" | tail -n +3
} > "$OUT/fonts.css.patch" || true

cat "$OUT/lib.ts.patch" \
	"$OUT/webmail.html.patch" \
	"$OUT/msg.html.patch" \
	"$OUT/text.html.patch" \
	"$OUT/fonts.css.patch" \
	"$OUT/favicon.svg.patch" \
	"$OUT/webmail.go.patch" \
	"$OUT/compose.go.patch" \
	"$OUT/compose_test.go.patch" \
	"$OUT/webmail.ts.patch" \
	> "$OUT/all-in-one.patch"

echo
echo "Patches written to $OUT/"
wc -l "$OUT"/*.patch
