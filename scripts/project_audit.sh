#!/usr/bin/env bash
# Monorepo audit: versions, compatibility, security → audit-report.md
set -u

REPORT="audit-report.md"
TS="$(date -u +"%Y-%m-%d %H:%M:%S UTC")"
GIT_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo 'n/a')"

have() { command -v "$1" >/dev/null 2>&1; }
json_or_note() { if [ -s "$1" ]; then cat "$1"; else echo "{}"; fi; }

NODE_PM=""
if [ -f pnpm-lock.yaml ] && have pnpm; then NODE_PM="pnpm"
elif have pnpm; then NODE_PM="pnpm"
elif have npm; then NODE_PM="npm"; fi

# Tool presence
NODE_VER="$(node -v 2>/dev/null || echo 'not installed')"
RUSTC_VER="$(rustc -V 2>/dev/null || echo 'not installed')"

# Prepare tmp
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "# 🔍 ViWorkS Project Audit Report" > "$REPORT"
echo "_Generated: $TS — Commit: $GIT_SHA" >> "$REPORT"
echo "" >> "$REPORT"

echo "## Repo Overview" >> "$REPORT"
echo "- Detected Node PM: ${NODE_PM:-none}" >> "$REPORT"
echo "- Node: ${NODE_VER}" >> "$REPORT"
echo "- Rust: ${RUSTC_VER}" >> "$REPORT"
echo "" >> "$REPORT"

###################################
## Node / Next.js / TypeScript
###################################
echo "## 🌐 Node / Next.js Audit" >> "$REPORT"

if [ -n "$NODE_PM" ]; then
  # Outdated
  if [ "$NODE_PM" = "pnpm" ]; then
    pnpm outdated --json > "$TMP/node_outdated.json" 2>/dev/null || true
    PNPM_LIST_CMD="pnpm ls --depth=1 --json"
    pnpm audit --json > "$TMP/node_audit.json" 2>/dev/null || true
  else
    npm outdated --json > "$TMP/node_outdated.json" 2>/dev/null || true
    PNPM_LIST_CMD=""
    npm audit --json > "$TMP/node_audit.json" 2>/dev/null || true
  fi

  echo "### Outdated Packages" >> "$REPORT"
  if have jq && [ -s "$TMP/node_outdated.json" ]; then
    echo "" >> "$REPORT"
    echo "| Package | Current | Wanted | Latest | Type |" >> "$REPORT"
    echo "|---|---:|---:|---:|---|" >> "$REPORT"
    jq -r 'to_entries[] | "| \(.key) | \(.value.current // "-") | \(.value.wanted // "-") | \(.value.latest // "-") | \(.value.type // "-") |"' "$TMP/node_outdated.json" >> "$REPORT"
  else
    echo "- (No data or jq missing.)" >> "$REPORT"
  fi
  echo "" >> "$REPORT"

  echo "### Security (npm/pnpm audit)" >> "$REPORT"
  if have jq && [ -s "$TMP/node_audit.json" ]; then
    # Handle both npm & pnpm audit formats
    HIGH=$(jq '..|.vulnerabilities?.high? // empty' "$TMP/node_audit.json" | jq -s 'add // 0')
    CRIT=$(jq '..|.vulnerabilities?.critical? // empty' "$TMP/node_audit.json" | jq -s 'add // 0')
    MOD=$(jq '..|.vulnerabilities?.moderate? // empty' "$TMP/node_audit.json" | jq -s 'add // 0')
    LOW=$(jq '..|.vulnerabilities?.low? // empty' "$TMP/node_audit.json" | jq -s 'add // 0')
    echo "- Critical: **$CRIT**, High: **$HIGH**, Moderate: $MOD, Low: $LOW" >> "$REPORT"
  else
    echo "- (Audit skipped or jq missing.)" >> "$REPORT"
  fi
  echo "" >> "$REPORT"

  echo "### Peer Dependency Check" >> "$REPORT"
  if [ -n "$PNPM_LIST_CMD" ] && have jq; then
    $PNPM_LIST_CMD > "$TMP/pnpm_ls.json" 2>/dev/null || true
    # Simple unmet peer scan:
    UNMET=$(jq '..|objects|select(has("problems"))|.problems[]?|select(test("peer"))' "$TMP/pnpm_ls.json" 2>/dev/null || echo "")
    if [ -n "$UNMET" ]; then
      echo "Some peer dependency issues detected:" >> "$REPORT"
      echo ''"$UNMET"'' | sed 's/^/- /' >> "$REPORT"
    else
      echo "- No unmet peer dependencies detected." >> "$REPORT"
    fi
  else
    echo "- Skipped (requires pnpm & jq)." >> "$REPORT"
  fi
  echo "" >> "$REPORT"
else
  echo "- Skipped: No Node package manager detected." >> "$REPORT"
  echo "" >> "$REPORT"
fi

###################################
## Rust (cargo)
###################################
echo "## 🦀 Rust Audit" >> "$REPORT"

# Find Rust projects
RUST_PROJECTS="$(find . -name "Cargo.toml" -not -path "./target/*" 2>/dev/null || true)"
if [ -n "$RUST_PROJECTS" ]; then
  echo "### Discovered Rust Projects" >> "$REPORT"
  echo '```' >> "$REPORT"
  echo "$RUST_PROJECTS" >> "$REPORT"
  echo '```' >> "$REPORT"
  echo "" >> "$REPORT"
fi

if have cargo; then
  # cargo-outdated
  if have cargo-outdated; then
    cargo outdated -R --workspace --format json > "$TMP/rust_outdated.json" 2>/dev/null || true
  else
    echo "- Note: cargo-outdated not found; install with \`cargo install cargo-outdated\`." >> "$REPORT"
    : > "$TMP/rust_outdated.json"
  fi

  # cargo-audit
  if have cargo-audit; then
    cargo audit --json > "$TMP/rust_audit.json" 2>/dev/null || true
  else
    echo "- Note: cargo-audit not found; install with \`cargo install cargo-audit\`." >> "$REPORT"
    : > "$TMP/rust_audit.json"
  fi

  # cargo-deny (optional)
  if have cargo-deny; then
    cargo deny check advisories bans licenses sources -L error -q -o json > "$TMP/rust_deny.json" 2>/dev/null || true
  else
    : > "$TMP/rust_deny.json"
  fi

  echo "### Outdated Crates" >> "$REPORT"
  if have jq && [ -s "$TMP/rust_outdated.json" ]; then
    echo "" >> "$REPORT"
    echo "| Crate | Current | Latest | Kind |" >> "$REPORT"
    echo "|---|---:|---:|---|" >> "$REPORT"
    jq -r '.packages[]? | "| \(.name) | \(.current // "-") | \(.latest // "-") | \(.kind // "-") |"' "$TMP/rust_outdated.json" >> "$REPORT"
  else
    echo "- (No data or jq missing.)" >> "$REPORT"
  fi
  echo "" >> "$REPORT"

  echo "### Security (RustSec)" >> "$REPORT"
  if have jq && [ -s "$TMP/rust_audit.json" ]; then
    CNT=$(jq '[.vulnerabilities.list[]?] | length' "$TMP/rust_audit.json")
    echo "- Vulnerable crates: **$CNT**" >> "$REPORT"
    if [ "$CNT" -gt 0 ]; then
      echo "" >> "$REPORT"
      echo "| Crate | Advisory | Title | Severity |" >> "$REPORT"
      echo "|---|---|---|---|" >> "$REPORT"
      jq -r '.vulnerabilities.list[] | "| \(.package.name) | \(.advisory.id) | \(.advisory.title) | \(.advisory.cvss.severity // "n/a") |"' "$TMP/rust_audit.json" >> "$REPORT"
    fi
  else
    echo "- (Audit skipped or jq missing.)" >> "$REPORT"
  fi
  echo "" >> "$REPORT"

  echo "### Policy (cargo-deny)" >> "$REPORT"
  if have jq && [ -s "$TMP/rust_deny.json" ]; then
    FAILS=$(jq '[.reports[]?|.diagnostics[]?|select(.severity=="error")] | length' "$TMP/rust_deny.json")
    echo "- cargo-deny errors: **$FAILS** (advisories/bans/licenses/sources)" >> "$REPORT"
  else
    echo "- Skipped (cargo-deny not installed)." >> "$REPORT"
  fi
  echo "" >> "$REPORT"
else
  echo "- Skipped: cargo not found." >> "$REPORT"
  echo "" >> "$REPORT"
fi

###################################
## Docker / Images
###################################
echo "## 🐳 Docker & Base Images" >> "$REPORT"

DOCKERFILES="$(find . -name "Dockerfile*" 2>/dev/null || true)"
FROM_LINES="$(find . -name "Dockerfile*" -exec grep -ho '^FROM .*$' {} \; 2>/dev/null || true)"

if [ -n "$DOCKERFILES" ]; then
  echo "### Discovered Dockerfiles" >> "$REPORT"
  echo '```' >> "$REPORT"
  echo "$DOCKERFILES" >> "$REPORT"
  echo '```' >> "$REPORT"
  echo "" >> "$REPORT"
  
  if [ -n "$FROM_LINES" ]; then
    echo "### Discovered Base Images" >> "$REPORT"
    echo '```' >> "$REPORT"
    echo "$FROM_LINES" >> "$REPORT"
    echo '```' >> "$REPORT"
  else
    echo "- No FROM lines found in Dockerfiles." >> "$REPORT"
  fi
else
  echo "- No Dockerfiles found." >> "$REPORT"
fi
echo "" >> "$REPORT"

if have trivy; then
  echo "### Trivy Image Scan (HIGH/CRITICAL)" >> "$REPORT"
  while read -r LINE; do
    IMG="$(echo "$LINE" | awk '{print $2}')"
    [ -n "$IMG" ] || continue
    trivy image --severity HIGH,CRITICAL --format table "$IMG" > "$TMP/trivy_${IMG//[:\/]/_}.txt" 2>/dev/null || true
    if [ -s "$TMP/trivy_${IMG//[:\/]/_}.txt" ]; then
      echo "**$IMG**" >> "$REPORT"
      echo '```' >> "$REPORT"
      cat "$TMP/trivy_${IMG//[:\/]/_}.txt" >> "$REPORT"
      echo '```' >> "$REPORT"
    else
      echo "- Scan skipped/failed for $IMG" >> "$REPORT"
    fi
    echo "" >> "$REPORT"
  done <<< "$FROM_LINES"
else
  echo "- Trivy not installed; skipping image CVE scan. Install: https://aquasec.github.io/trivy/" >> "$REPORT"
  echo "" >> "$REPORT"
fi

###################################
## Action Items
###################################
echo "## ✅ Action Items (Quick Wins First)" >> "$REPORT"
echo "- **Update Node deps (safe patch/minor)** where \`wanted < latest\` and no peer issues." >> "$REPORT"
echo "- **Fix HIGH/CRITICAL vulns** reported by npm/pnpm audit and/or Trivy." >> "$REPORT"
echo "- **Rust**: bump crates flagged by cargo-audit; prefer patch/minor; schedule major upgrades." >> "$REPORT"
echo "- **Confirm base images** to LTS/stable (e.g., node:22-*, postgres:17.*, redis:8.*, rust:1.89-*)." >> "$REPORT"
echo "" >> "$REPORT"

echo "Done. See ./$REPORT"
