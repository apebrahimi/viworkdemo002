#!/bin/bash
# Weekly Security Audit Script for ViWorkS Admin Backend
# This script monitors for vulnerabilities and unwanted dependencies

set -e  # Exit on any error

echo "🔍 ViWorkS Security Audit - $(date)"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    print_status "ERROR" "Not in a Rust project directory. Please run from the project root."
    exit 1
fi

print_status "INFO" "Starting security audit..."

# 1. Check for vulnerabilities
print_status "INFO" "Running cargo audit..."
if cargo audit; then
    print_status "SUCCESS" "No new vulnerabilities found"
else
    print_status "WARNING" "Vulnerabilities detected - check output above"
fi

echo ""

# 2. Check dependency tree for unwanted dependencies
print_status "INFO" "Checking dependency tree for unwanted dependencies..."

# Check for MySQL dependencies
if cargo tree | grep -i "mysql" > /dev/null; then
    print_status "ERROR" "Found MySQL dependencies - this should not happen!"
    cargo tree | grep -i "mysql"
else
    print_status "SUCCESS" "No MySQL dependencies found"
fi

# Check for RSA dependencies
if cargo tree | grep -i "rsa" > /dev/null; then
    print_status "WARNING" "Found RSA dependencies (expected due to SQLx)"
    print_status "INFO" "This is expected but being monitored"
else
    print_status "SUCCESS" "No RSA dependencies found"
fi

echo ""

# 3. Check SQLx configuration
print_status "INFO" "Checking SQLx configuration..."

# Check if default features are disabled
if grep -q "default-features = false" Cargo.toml; then
    print_status "SUCCESS" "SQLx default features are disabled (good security practice)"
else
    print_status "WARNING" "SQLx default features are enabled - consider disabling"
fi

# Check if only PostgreSQL features are enabled
if grep -q "features = \[.*postgres.*\]" Cargo.toml; then
    print_status "SUCCESS" "PostgreSQL features are explicitly enabled"
else
    print_status "WARNING" "PostgreSQL features not explicitly configured"
fi

echo ""

# 4. Check for SQLx version
print_status "INFO" "Checking SQLx version..."
SQLX_VERSION=$(grep -o 'sqlx = { version = "[^"]*"' Cargo.toml | grep -o '"[^"]*"' | tr -d '"')
print_status "INFO" "Current SQLx version: $SQLX_VERSION"

# Check if there's a newer version available
print_status "INFO" "Checking for newer SQLx versions..."
# This would require cargo-outdated or similar tool
print_status "INFO" "Consider running 'cargo outdated' to check for updates"

echo ""

# 5. Check compilation
print_status "INFO" "Checking if project compiles..."
if cargo check --quiet; then
    print_status "SUCCESS" "Project compiles successfully"
else
    print_status "ERROR" "Project compilation failed"
    exit 1
fi

echo ""

# 6. Security recommendations
print_status "INFO" "Security Recommendations:"
echo "  1. Monitor RUSTSEC advisories regularly"
echo "  2. Keep SQLx updated when new versions are available"
echo "  3. Consider implementing runtime security monitoring"
echo "  4. Review this audit weekly"
echo "  5. Set up automated alerts for new vulnerabilities"

echo ""

# 7. Generate report
REPORT_FILE="security-audit-$(date +%Y%m%d).txt"
{
    echo "ViWorkS Security Audit Report - $(date)"
    echo "======================================="
    echo ""
    echo "Cargo Audit Status:"
    cargo audit 2>&1 || echo "Vulnerabilities found"
    echo ""
    echo "Dependency Tree Check:"
    echo "MySQL dependencies: $(cargo tree | grep -i mysql | wc -l | tr -d ' ')"
    echo "RSA dependencies: $(cargo tree | grep -i rsa | wc -l | tr -d ' ')"
    echo ""
    echo "SQLx Configuration:"
    grep -A 5 -B 5 "sqlx" Cargo.toml
} > "$REPORT_FILE"

print_status "SUCCESS" "Security audit completed successfully"
print_status "INFO" "Report saved to: $REPORT_FILE"

echo ""
print_status "INFO" "Next audit scheduled: $(date -d '+7 days' '+%Y-%m-%d')"
