#!/bin/sh
set -e

if [ -n "$WEBHOOK_URL" ]; then
  echo "Notifying webhook: $WEBHOOK_URL"
  curl -sS -X POST "$WEBHOOK_URL" -H 'Content-Type: application/json' -d '{"status":"deployed"}' || true
fi


