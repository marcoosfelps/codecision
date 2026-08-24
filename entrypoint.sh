#!/bin/sh
cat <<EOF > /usr/share/caddy/env-config.js
window.ENV = {
  GOOGLE_SHEETS_ENDPOINT: "${GOOGLE_SHEETS_ENDPOINT:-}"
};
EOF

exec "$@"
