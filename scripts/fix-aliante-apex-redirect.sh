#!/usr/bin/env bash
# Set aliantehomesforsale.com apex→www redirect to 308 Permanent (Vercel default is 307).
set -euo pipefail

: "${VERCEL_TOKEN:?VERCEL_TOKEN required}"
TEAM_ID="${VERCEL_TEAM_ID:-team_EIbjFXaDDtGMTweb5Hvo3CG3}"
PROJECT_ID="${VERCEL_PROJECT_ID_ALIANTE:-prj_0RZw34lbC34PRwztLG5bqduiRxwY}"
DOMAIN="aliantehomesforsale.com"
REDIRECT_TO="www.aliantehomesforsale.com"

echo "Fetching current domain config for ${DOMAIN}..."
BEFORE=$(curl -sS -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${DOMAIN}?teamId=${TEAM_ID}")
echo "$BEFORE" | python3 -c 'import json,sys; d=json.load(sys.stdin); print("before:", {k:d.get(k) for k in ("name","redirect","redirectStatusCode","verified")})'

echo "Patching redirectStatusCode → 308..."
AFTER=$(curl -sS -X PATCH -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${DOMAIN}?teamId=${TEAM_ID}" \
  -d "{\"redirect\":\"${REDIRECT_TO}\",\"redirectStatusCode\":308}")
echo "$AFTER" | python3 -c 'import json,sys; d=json.load(sys.stdin); print("after:", {k:d.get(k) for k in ("name","redirect","redirectStatusCode","verified","error","message")}); 
err=d.get("error") or d.get("message");
raise SystemExit(1 if err and not d.get("name") else 0)'

echo "Verifying live headers..."
sleep 2
curl -sI "https://${DOMAIN}/" | tr -d '\r' | grep -iE 'HTTP/|location:'
