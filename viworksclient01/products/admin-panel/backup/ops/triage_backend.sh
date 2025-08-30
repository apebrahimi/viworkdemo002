#!/usr/bin/env bash
set -eu
SVC="${1:-backend}"

echo "🐳 Inspecting container state..."
docker compose ps $SVC || true
CID="$(docker compose ps -q $SVC || true)"

if [ -n "$CID" ]; then
  echo "🔎 docker inspect (state):"
  docker inspect --format '{{json .State}}' "$CID" | jq .
  echo "📈 RestartCount:"; docker inspect --format '{{.RestartCount}}' "$CID" || true
fi

echo "🗒️  Recent events (2m):"
docker events --since 120s --until 5s 2>/dev/null | sed -n "1,120p" || true

echo "📜 Container logs (all):"
docker logs --details --tail=200 "$CID" || true

echo "🧰 Live shell (exits immediately if not running):"
if [ -n "$CID" ]; then
  docker exec -it "$CID" sh -lc 'echo "PID1:"; ps -o pid,ppid,cmd -p 1; echo; echo "/proc/1/limits"; cat /proc/1/limits || true; echo; echo "Listening sockets:"; ss -lntup || true'
fi

echo "✅ Triage done."
