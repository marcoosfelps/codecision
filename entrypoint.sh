#!/bin/sh
cat <<ENV_EOF > /usr/share/caddy/env-config.js
window.ENV = {
  GOOGLE_SHEETS_ENDPOINT: "${GOOGLE_SHEETS_ENDPOINT:-}"
};
window.CODECISION_SHEETS_ENDPOINT = "${GOOGLE_SHEETS_ENDPOINT:-}";
ENV_EOF

cat <<CONFIG_EOF > /usr/share/caddy/config.js
window.CODECISION_SHEETS_ENDPOINT = "${GOOGLE_SHEETS_ENDPOINT:-}";
CONFIG_EOF

exec "$@"
