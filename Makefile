.PHONY: audit audit-node audit-rust audit-docker tools
audit:
	./scripts/project_audit.sh || true

audit-node:
	@[ -f pnpm-lock.yaml ] && pnpm outdated || npm outdated || true
	@[ -f pnpm-lock.yaml ] && pnpm audit || npm audit || true

audit-rust:
	@cargo outdated -R || true
	@cargo audit || true

audit-docker:
	@grep -Rho '^FROM .*$' -- Dockerfile* || true
	@trivy --version >/dev/null 2>&1 && echo "Run: trivy image <image>" || echo "Install trivy to scan images"

tools:
	@echo "Optional installs: cargo-audit, cargo-outdated, cargo-deny, trivy, jq"
