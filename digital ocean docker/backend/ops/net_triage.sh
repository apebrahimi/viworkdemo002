#!/usr/bin/env sh
set -eu
echo "🔎 DNS:"
cat /etc/resolv.conf || true
echo "🔎 Hosts:"
cat /etc/hosts || true
echo "🔎 Can we resolve postgres/redis?"
getent hosts postgres || true
getent hosts redis || true
echo "🔎 Try TCP:"
nc -zv -w 3 postgres 5432 || true
nc -zv -w 3 redis 6379 || true
