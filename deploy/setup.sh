#!/usr/bin/env bash
# First-time production setup on the VPS (Ubuntu/Debian).
# Usage: bash deploy/setup.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  cp deploy/env.production.template .env
  echo "Created .env from deploy/env.production.template — edit secrets before starting."
  exit 1
fi

echo "Installing dependencies..."
npm ci

echo "Building frontend (same-origin API)..."
export VITE_API_URL=/api/v1
npm run build

echo "Starting PM2 processes..."
if ! command -v pm2 >/dev/null 2>&1; then
  echo "Install PM2 first: npm install -g pm2"
  exit 1
fi
pm2 start ecosystem.config.cjs
pm2 save

echo "Done. App should be live at the APP_URL in .env (default http://72.62.76.198:8080)"
echo "Health check: curl -s http://127.0.0.1:8080/api/v1/health"
