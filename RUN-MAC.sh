#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo 'Chưa có Node.js. Cài Node.js 24 LTS từ https://nodejs.org/en/download rồi mở lại Terminal.'
  exit 1
fi
node -e 'const [major,minor]=process.versions.node.split(".").map(Number);if(major<22||(major===22&&minor<18)){console.error("Cần Node.js >=22.18; nên cài Node.js 24 LTS.");process.exit(1)}'
case "${1:-demo}" in
 demo) exec node scripts/mac-demo.mjs ;;
 dev)
  if [ ! -d node_modules ]; then
    echo 'Cài dependency cho mã nguồn (cần Internet)...'
    npx --yes pnpm@11.25.0 install --frozen-lockfile
  fi
  if [ ! -f .env ]; then cp .env.example .env; fi
  exec node scripts/dev-full.mjs
  ;;
 *) echo 'Dùng: bash RUN-MAC.sh [demo|dev]'; exit 1 ;;
esac
