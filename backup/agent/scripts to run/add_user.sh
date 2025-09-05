#!/bin/bash
APP_FILE="/opt/ViWorks/app.py"

if [ $# -ne 2 ]; then
    echo "Usage: bash $0 <username> <password>"
    exit 1
fi

USERNAME="$1"
PASSWORD="$2"

HASH=$(python3 - <<EOF
from werkzeug.security import generate_password_hash
print(generate_password_hash("$PASSWORD"))
EOF
)

if [ -z "$HASH" ]; then
    echo "❌ Error: could not generate hash."
    exit 1
fi

TMP_FILE=$(mktemp)
awk -v user="$USERNAME" -v hash="$HASH" '
/^VALID_USERS = {$/ {
    print
    getline
    if ($0 !~ /^}/) {
        print "    '\''" user "'\'': '\''" hash "'\'',"
    } else {
        print "    '\''" user "'\'': '\''" hash "'\'',"
        print $0
        next
    }
}
{ print }
' "$APP_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$APP_FILE"

echo "✅ User '$USERNAME' added successfully to VALID_USERS in app.py"
