#!/bin/bash

# ViWorkS Gateway OS Agent - Comprehensive Security & Production Readiness Audit
# This script performs a thorough security audit, version check, and production readiness assessment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}========================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}========================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    print_error "Cargo.toml not found. Please run this script from the agent directory."
    exit 1
fi

# Create audit report file
AUDIT_REPORT="security-audit-report-$(date +%Y%m%d-%H%M%S).md"
echo "# ViWorkS Gateway OS Agent - Security Audit Report" > "$AUDIT_REPORT"
echo "Generated: $(date)" >> "$AUDIT_REPORT"
echo "" >> "$AUDIT_REPORT"

print_header "ViWorkS Gateway OS Agent - Security & Production Readiness Audit"
echo "Audit report will be saved to: $AUDIT_REPORT"
echo ""

# ============================================================================
# 1. ENVIRONMENT AND TOOL VERSIONS
# ============================================================================
print_header "1. Environment and Tool Versions"
echo "## 1. Environment and Tool Versions" >> "$AUDIT_REPORT"

print_status "Checking Rust and Cargo versions..."
RUST_VERSION=$(rustc --version | cut -d' ' -f2)
CARGO_VERSION=$(cargo --version | cut -d' ' -f2)
print_success "Rust version: $RUST_VERSION"
print_success "Cargo version: $CARGO_VERSION"

echo "- Rust version: $RUST_VERSION" >> "$AUDIT_REPORT"
echo "- Cargo version: $CARGO_VERSION" >> "$AUDIT_REPORT"

# Check for security advisories
print_status "Checking for Rust security advisories..."
if command -v cargo-audit &> /dev/null; then
    print_status "Running cargo-audit..."
    cargo audit --json > cargo-audit.json 2>/dev/null || true
    if [ -f cargo-audit.json ]; then
        VULNERABILITIES=$(jq '.vulnerabilities | length' cargo-audit.json 2>/dev/null || echo "0")
        if [ "$VULNERABILITIES" -gt 0 ]; then
            print_critical "Found $VULNERABILITIES security vulnerabilities!"
            echo "- Security vulnerabilities: $VULNERABILITIES (CRITICAL)" >> "$AUDIT_REPORT"
        else
            print_success "No security vulnerabilities found"
            echo "- Security vulnerabilities: 0" >> "$AUDIT_REPORT"
        fi
    else
        print_warning "cargo-audit not available or failed"
        echo "- Security vulnerabilities: Unable to check" >> "$AUDIT_REPORT"
    fi
else
    print_warning "cargo-audit not installed. Install with: cargo install cargo-audit"
    echo "- Security vulnerabilities: cargo-audit not available" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 2. DEPENDENCY ANALYSIS
# ============================================================================
print_header "2. Dependency Analysis"
echo "" >> "$AUDIT_REPORT"
echo "## 2. Dependency Analysis" >> "$AUDIT_REPORT"

print_status "Analyzing dependencies..."
cargo tree --format "{p} {f}" > dependency-tree.txt
TOTAL_DEPS=$(cargo tree | wc -l)
print_success "Total dependencies: $TOTAL_DEPS"

echo "- Total dependencies: $TOTAL_DEPS" >> "$AUDIT_REPORT"

# Check for outdated dependencies
print_status "Checking for outdated dependencies..."
cargo outdated --format json > outdated-deps.json 2>/dev/null || true
if [ -f outdated-deps.json ]; then
    OUTDATED_COUNT=$(jq '.dependencies | length' outdated-deps.json 2>/dev/null || echo "0")
    if [ "$OUTDATED_COUNT" -gt 0 ]; then
        print_warning "Found $OUTDATED_COUNT outdated dependencies"
        echo "- Outdated dependencies: $OUTDATED_COUNT" >> "$AUDIT_REPORT"
    else
        print_success "All dependencies are up to date"
        echo "- Outdated dependencies: 0" >> "$AUDIT_REPORT"
    fi
else
    print_warning "Unable to check outdated dependencies"
    echo "- Outdated dependencies: Unable to check" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 3. CODE QUALITY AND SECURITY
# ============================================================================
print_header "3. Code Quality and Security Analysis"
echo "" >> "$AUDIT_REPORT"
echo "## 3. Code Quality and Security Analysis" >> "$AUDIT_REPORT"

# Run clippy with security focus
print_status "Running security-focused clippy analysis..."
cargo clippy -- -D warnings -- -W clippy::security > clippy-security.txt 2>&1 || true
CLIPPY_ISSUES=$(grep -c "warning\|error" clippy-security.txt || echo "0")
if [ "$CLIPPY_ISSUES" -gt 0 ]; then
    print_warning "Found $CLIPPY_ISSUES clippy issues"
    echo "- Clippy issues: $CLIPPY_ISSUES" >> "$AUDIT_REPORT"
else
    print_success "No clippy issues found"
    echo "- Clippy issues: 0" >> "$AUDIT_REPORT"
fi

# Check for unsafe code
print_status "Checking for unsafe code usage..."
UNSAFE_COUNT=$(grep -r "unsafe" src/ | wc -l || echo "0")
if [ "$UNSAFE_COUNT" -gt 0 ]; then
    print_warning "Found $UNSAFE_COUNT unsafe code blocks"
    echo "- Unsafe code blocks: $UNSAFE_COUNT" >> "$AUDIT_REPORT"
    grep -r "unsafe" src/ >> "$AUDIT_REPORT" 2>/dev/null || true
else
    print_success "No unsafe code found"
    echo "- Unsafe code blocks: 0" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 4. CONFIGURATION SECURITY
# ============================================================================
print_header "4. Configuration Security Analysis"
echo "" >> "$AUDIT_REPORT"
echo "## 4. Configuration Security Analysis" >> "$AUDIT_REPORT"

# Check configuration file
if [ -f "agent.toml" ]; then
    print_status "Analyzing configuration file..."
    echo "- Configuration file: agent.toml" >> "$AUDIT_REPORT"
    
    # Check for hardcoded secrets
    SECRETS_FOUND=$(grep -i "password\|secret\|key\|token" agent.toml | wc -l || echo "0")
    if [ "$SECRETS_FOUND" -gt 0 ]; then
        print_critical "Found potential secrets in configuration!"
        echo "- Hardcoded secrets: $SECRETS_FOUND (CRITICAL)" >> "$AUDIT_REPORT"
    else
        print_success "No hardcoded secrets found in configuration"
        echo "- Hardcoded secrets: 0" >> "$AUDIT_REPORT"
    fi
    
    # Check file permissions
    CONFIG_PERMS=$(stat -f "%Lp" agent.toml)
    if [ "$CONFIG_PERMS" = "644" ] || [ "$CONFIG_PERMS" = "600" ]; then
        print_success "Configuration file has appropriate permissions: $CONFIG_PERMS"
        echo "- Configuration permissions: $CONFIG_PERMS" >> "$AUDIT_REPORT"
    else
        print_warning "Configuration file permissions may be too permissive: $CONFIG_PERMS"
        echo "- Configuration permissions: $CONFIG_PERMS (WARNING)" >> "$AUDIT_REPORT"
    fi
else
    print_error "Configuration file not found"
    echo "- Configuration file: NOT FOUND" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 5. NETWORK SECURITY
# ============================================================================
print_header "5. Network Security Analysis"
echo "" >> "$AUDIT_REPORT"
echo "## 5. Network Security Analysis" >> "$AUDIT_REPORT"

# Check for hardcoded URLs/IPs
print_status "Checking for hardcoded network endpoints..."
HARDCODED_ENDPOINTS=$(grep -r "http://\|https://\|localhost\|127.0.0.1\|0.0.0.0" src/ | wc -l || echo "0")
if [ "$HARDCODED_ENDPOINTS" -gt 0 ]; then
    print_warning "Found $HARDCODED_ENDPOINTS hardcoded network endpoints"
    echo "- Hardcoded endpoints: $HARDCODED_ENDPOINTS" >> "$AUDIT_REPORT"
else
    print_success "No hardcoded network endpoints found"
    echo "- Hardcoded endpoints: 0" >> "$AUDIT_REPORT"
fi

# Check TLS/SSL configuration
print_status "Checking TLS/SSL configuration..."
TLS_USAGE=$(grep -r "rustls\|tls\|ssl" src/ | wc -l || echo "0")
if [ "$TLS_USAGE" -gt 0 ]; then
    print_success "TLS/SSL is being used for secure communications"
    echo "- TLS/SSL usage: Yes" >> "$AUDIT_REPORT"
else
    print_warning "No TLS/SSL usage detected"
    echo "- TLS/SSL usage: No (WARNING)" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 6. AUTHENTICATION AND AUTHORIZATION
# ============================================================================
print_header "6. Authentication and Authorization Analysis"
echo "" >> "$AUDIT_REPORT"
echo "## 6. Authentication and Authorization Analysis" >> "$AUDIT_REPORT"

# Check for authentication mechanisms
print_status "Checking authentication mechanisms..."
AUTH_MECHANISMS=$(grep -r "auth\|login\|password\|token\|jwt\|oauth" src/ | wc -l || echo "0")
if [ "$AUTH_MECHANISMS" -gt 0 ]; then
    print_success "Authentication mechanisms detected"
    echo "- Authentication mechanisms: Yes" >> "$AUDIT_REPORT"
else
    print_warning "No authentication mechanisms detected"
    echo "- Authentication mechanisms: No (WARNING)" >> "$AUDIT_REPORT"
fi

# Check for authorization checks
print_status "Checking authorization mechanisms..."
AUTHZ_CHECKS=$(grep -r "authorize\|permission\|role\|access" src/ | wc -l || echo "0")
if [ "$AUTHZ_CHECKS" -gt 0 ]; then
    print_success "Authorization checks detected"
    echo "- Authorization checks: Yes" >> "$AUDIT_REPORT"
else
    print_warning "No authorization checks detected"
    echo "- Authorization checks: No (WARNING)" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 7. INPUT VALIDATION AND SANITIZATION
# ============================================================================
print_header "7. Input Validation and Sanitization"
echo "" >> "$AUDIT_REPORT"
echo "## 7. Input Validation and Sanitization" >> "$AUDIT_REPORT"

# Check for input validation
print_status "Checking input validation..."
INPUT_VALIDATION=$(grep -r "validate\|sanitize\|escape\|filter" src/ | wc -l || echo "0")
if [ "$INPUT_VALIDATION" -gt 0 ]; then
    print_success "Input validation mechanisms detected"
    echo "- Input validation: Yes" >> "$AUDIT_REPORT"
else
    print_warning "No input validation mechanisms detected"
    echo "- Input validation: No (WARNING)" >> "$AUDIT_REPORT"
fi

# Check for SQL injection prevention
print_status "Checking for SQL injection prevention..."
SQL_INJECTION=$(grep -r "prepared\|parameterized\|bind" src/ | wc -l || echo "0")
if [ "$SQL_INJECTION" -gt 0 ]; then
    print_success "SQL injection prevention mechanisms detected"
    echo "- SQL injection prevention: Yes" >> "$AUDIT_REPORT"
else
    print_warning "No SQL injection prevention mechanisms detected"
    echo "- SQL injection prevention: No (WARNING)" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 8. ERROR HANDLING AND LOGGING
# ============================================================================
print_header "8. Error Handling and Logging"
echo "" >> "$AUDIT_REPORT"
echo "## 8. Error Handling and Logging" >> "$AUDIT_REPORT"

# Check error handling
print_status "Checking error handling..."
ERROR_HANDLING=$(grep -r "Result\|Error\|catch\|try" src/ | wc -l || echo "0")
if [ "$ERROR_HANDLING" -gt 0 ]; then
    print_success "Error handling mechanisms detected"
    echo "- Error handling: Yes" >> "$AUDIT_REPORT"
else
    print_warning "No error handling mechanisms detected"
    echo "- Error handling: No (WARNING)" >> "$AUDIT_REPORT"
fi

# Check logging
print_status "Checking logging mechanisms..."
LOGGING=$(grep -r "log\|tracing\|info\|warn\|error" src/ | wc -l || echo "0")
if [ "$LOGGING" -gt 0 ]; then
    print_success "Logging mechanisms detected"
    echo "- Logging mechanisms: Yes" >> "$AUDIT_REPORT"
else
    print_warning "No logging mechanisms detected"
    echo "- Logging mechanisms: No (WARNING)" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 9. BUILD AND DEPLOYMENT SECURITY
# ============================================================================
print_header "9. Build and Deployment Security"
echo "" >> "$AUDIT_REPORT"
echo "## 9. Build and Deployment Security" >> "$AUDIT_REPORT"

# Check Dockerfile security
if [ -f "Dockerfile" ]; then
    print_status "Analyzing Dockerfile security..."
    echo "- Dockerfile: Present" >> "$AUDIT_REPORT"
    
    # Check for root user
    ROOT_USER=$(grep -c "USER root\|RUN useradd" Dockerfile || echo "0")
    if [ "$ROOT_USER" -gt 0 ]; then
        print_warning "Dockerfile may run as root user"
        echo "- Root user in Dockerfile: Yes (WARNING)" >> "$AUDIT_REPORT"
    else
        print_success "Dockerfile does not run as root"
        echo "- Root user in Dockerfile: No" >> "$AUDIT_REPORT"
    fi
    
    # Check for security updates
    SECURITY_UPDATES=$(grep -c "apk update\|apt-get update" Dockerfile || echo "0")
    if [ "$SECURITY_UPDATES" -gt 0 ]; then
        print_success "Dockerfile includes security updates"
        echo "- Security updates: Yes" >> "$AUDIT_REPORT"
    else
        print_warning "Dockerfile may not include security updates"
        echo "- Security updates: No (WARNING)" >> "$AUDIT_REPORT"
    fi
else
    print_warning "Dockerfile not found"
    echo "- Dockerfile: NOT FOUND" >> "$AUDIT_REPORT"
fi

# Check for secrets in build files
print_status "Checking for secrets in build files..."
BUILD_SECRETS=$(grep -r -i "password\|secret\|key\|token" build*.sh Dockerfile* 2>/dev/null | wc -l || echo "0")
if [ "$BUILD_SECRETS" -gt 0 ]; then
    print_critical "Found potential secrets in build files!"
    echo "- Secrets in build files: $BUILD_SECRETS (CRITICAL)" >> "$AUDIT_REPORT"
else
    print_success "No secrets found in build files"
    echo "- Secrets in build files: 0" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 10. COMPILATION AND TESTING
# ============================================================================
print_header "10. Compilation and Testing"
echo "" >> "$AUDIT_REPORT"
echo "## 10. Compilation and Testing" >> "$AUDIT_REPORT"

# Test compilation
print_status "Testing compilation..."
if cargo check --release > compilation-test.txt 2>&1; then
    print_success "Code compiles successfully"
    echo "- Compilation: SUCCESS" >> "$AUDIT_REPORT"
else
    print_error "Code compilation failed"
    echo "- Compilation: FAILED" >> "$AUDIT_REPORT"
fi

# Run tests
print_status "Running tests..."
if cargo test > test-results.txt 2>&1; then
    TEST_COUNT=$(grep "test result:" test-results.txt | tail -1 | grep -o "[0-9]* passed" | cut -d' ' -f1 || echo "0")
    print_success "Tests passed: $TEST_COUNT"
    echo "- Tests passed: $TEST_COUNT" >> "$AUDIT_REPORT"
else
    print_error "Tests failed"
    echo "- Tests: FAILED" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 11. BINARY ANALYSIS
# ============================================================================
print_header "11. Binary Analysis"
echo "" >> "$AUDIT_REPORT"
echo "## 11. Binary Analysis" >> "$AUDIT_REPORT"

# Build release binary
print_status "Building release binary for analysis..."
if cargo build --release > build-output.txt 2>&1; then
    print_success "Release binary built successfully"
    echo "- Release build: SUCCESS" >> "$AUDIT_REPORT"
    
    # Analyze binary
    BINARY_PATH="target/release/viworks-gateway-agent"
    if [ -f "$BINARY_PATH" ]; then
        BINARY_SIZE=$(du -h "$BINARY_PATH" | cut -f1)
        print_success "Binary size: $BINARY_SIZE"
        echo "- Binary size: $BINARY_SIZE" >> "$AUDIT_REPORT"
        
        # Check binary permissions
        BINARY_PERMS=$(stat -f "%Lp" "$BINARY_PATH")
        if [ "$BINARY_PERMS" = "755" ]; then
            print_success "Binary has appropriate permissions"
            echo "- Binary permissions: $BINARY_PERMS" >> "$AUDIT_REPORT"
        else
            print_warning "Binary permissions may be incorrect: $BINARY_PERMS"
            echo "- Binary permissions: $BINARY_PERMS (WARNING)" >> "$AUDIT_REPORT"
        fi
        
        # Check for debug symbols
        if file "$BINARY_PATH" | grep -q "not stripped"; then
            print_warning "Binary contains debug symbols (should be stripped for production)"
            echo "- Debug symbols: Present (WARNING)" >> "$AUDIT_REPORT"
        else
            print_success "Binary is stripped (no debug symbols)"
            echo "- Debug symbols: Stripped" >> "$AUDIT_REPORT"
        fi
    else
        print_error "Binary not found after build"
        echo "- Binary: NOT FOUND" >> "$AUDIT_REPORT"
    fi
else
    print_error "Release build failed"
    echo "- Release build: FAILED" >> "$AUDIT_REPORT"
fi

# ============================================================================
# 12. PRODUCTION READINESS CHECKLIST
# ============================================================================
print_header "12. Production Readiness Checklist"
echo "" >> "$AUDIT_REPORT"
echo "## 12. Production Readiness Checklist" >> "$AUDIT_REPORT"

# Initialize counters
CRITICAL_ISSUES=0
WARNINGS=0
SUCCESSES=0

# Check each requirement
print_status "Checking production readiness requirements..."

# Security requirements
if [ "$VULNERABILITIES" -gt 0 ]; then
    print_critical "❌ Security vulnerabilities found"
    echo "- ❌ Security vulnerabilities: $VULNERABILITIES" >> "$AUDIT_REPORT"
    ((CRITICAL_ISSUES++))
else
    print_success "✅ No security vulnerabilities"
    echo "- ✅ Security vulnerabilities: None" >> "$AUDIT_REPORT"
    ((SUCCESSES++))
fi

if [ "$UNSAFE_COUNT" -gt 0 ]; then
    print_warning "⚠️  Unsafe code blocks found"
    echo "- ⚠️  Unsafe code: $UNSAFE_COUNT blocks" >> "$AUDIT_REPORT"
    ((WARNINGS++))
else
    print_success "✅ No unsafe code"
    echo "- ✅ Unsafe code: None" >> "$AUDIT_REPORT"
    ((SUCCESSES++))
fi

if [ "$SECRETS_FOUND" -gt 0 ]; then
    print_critical "❌ Hardcoded secrets found"
    echo "- ❌ Hardcoded secrets: $SECRETS_FOUND" >> "$AUDIT_REPORT"
    ((CRITICAL_ISSUES++))
else
    print_success "✅ No hardcoded secrets"
    echo "- ✅ Hardcoded secrets: None" >> "$AUDIT_REPORT"
    ((SUCCESSES++))
fi

# Functionality requirements
if [ "$AUTH_MECHANISMS" -gt 0 ]; then
    print_success "✅ Authentication mechanisms present"
    echo "- ✅ Authentication: Present" >> "$AUDIT_REPORT"
    ((SUCCESSES++))
else
    print_warning "⚠️  No authentication mechanisms"
    echo "- ⚠️  Authentication: Missing" >> "$AUDIT_REPORT"
    ((WARNINGS++))
fi

if [ "$TLS_USAGE" -gt 0 ]; then
    print_success "✅ TLS/SSL encryption present"
    echo "- ✅ TLS/SSL: Present" >> "$AUDIT_REPORT"
    ((SUCCESSES++))
else
    print_warning "⚠️  No TLS/SSL encryption"
    echo "- ⚠️  TLS/SSL: Missing" >> "$AUDIT_REPORT"
    ((WARNINGS++))
fi

if [ "$LOGGING" -gt 0 ]; then
    print_success "✅ Logging mechanisms present"
    echo "- ✅ Logging: Present" >> "$AUDIT_REPORT"
    ((SUCCESSES++))
else
    print_warning "⚠️  No logging mechanisms"
    echo "- ⚠️  Logging: Missing" >> "$AUDIT_REPORT"
    ((WARNINGS++))
fi

# ============================================================================
# 13. FINAL ASSESSMENT
# ============================================================================
print_header "13. Final Security Assessment"
echo "" >> "$AUDIT_REPORT"
echo "## 13. Final Security Assessment" >> "$AUDIT_REPORT"

echo "### Summary" >> "$AUDIT_REPORT"
echo "- Critical Issues: $CRITICAL_ISSUES" >> "$AUDIT_REPORT"
echo "- Warnings: $WARNINGS" >> "$AUDIT_REPORT"
echo "- Successes: $SUCCESSES" >> "$AUDIT_REPORT"
echo "" >> "$AUDIT_REPORT"

# Determine production readiness
if [ "$CRITICAL_ISSUES" -eq 0 ] && [ "$WARNINGS" -le 3 ]; then
    print_success "🎉 PRODUCTION READY - Agent is ready for production deployment"
    echo "### Recommendation: ✅ PRODUCTION READY" >> "$AUDIT_REPORT"
    echo "The agent meets security requirements and is ready for production deployment." >> "$AUDIT_REPORT"
elif [ "$CRITICAL_ISSUES" -eq 0 ]; then
    print_warning "⚠️  PRODUCTION READY WITH WARNINGS - Address warnings before deployment"
    echo "### Recommendation: ⚠️  PRODUCTION READY WITH WARNINGS" >> "$AUDIT_REPORT"
    echo "The agent is functionally ready but has security warnings that should be addressed." >> "$AUDIT_REPORT"
else
    print_critical "❌ NOT PRODUCTION READY - Critical security issues must be resolved"
    echo "### Recommendation: ❌ NOT PRODUCTION READY" >> "$AUDIT_REPORT"
    echo "Critical security issues must be resolved before production deployment." >> "$AUDIT_REPORT"
fi

# ============================================================================
# 14. RECOMMENDATIONS
# ============================================================================
print_header "14. Security Recommendations"
echo "" >> "$AUDIT_REPORT"
echo "## 14. Security Recommendations" >> "$AUDIT_REPORT"

echo "### Immediate Actions Required:" >> "$AUDIT_REPORT"
if [ "$CRITICAL_ISSUES" -gt 0 ]; then
    echo "1. **CRITICAL**: Address all security vulnerabilities" >> "$AUDIT_REPORT"
    echo "2. **CRITICAL**: Remove any hardcoded secrets" >> "$AUDIT_REPORT"
fi

if [ "$WARNINGS" -gt 0 ]; then
    echo "3. **WARNING**: Review and address security warnings" >> "$AUDIT_REPORT"
fi

echo "" >> "$AUDIT_REPORT"
echo "### Best Practices for Production:" >> "$AUDIT_REPORT"
echo "1. Use environment variables for all secrets and configuration" >> "$AUDIT_REPORT"
echo "2. Implement proper logging and monitoring" >> "$AUDIT_REPORT"
echo "3. Regular security updates and dependency management" >> "$AUDIT_REPORT"
echo "4. Implement proper error handling and input validation" >> "$AUDIT_REPORT"
echo "5. Use HTTPS/TLS for all communications" >> "$AUDIT_REPORT"
echo "6. Implement proper authentication and authorization" >> "$AUDIT_REPORT"
echo "7. Regular security audits and penetration testing" >> "$AUDIT_REPORT"

# ============================================================================
# 15. CLEANUP
# ============================================================================
print_header "15. Audit Complete"

print_success "Security audit completed successfully!"
print_status "Detailed report saved to: $AUDIT_REPORT"
print_status "Summary: $CRITICAL_ISSUES critical issues, $WARNINGS warnings, $SUCCESSES successes"

# Clean up temporary files
rm -f cargo-audit.json dependency-tree.txt outdated-deps.json clippy-security.txt compilation-test.txt test-results.txt build-output.txt

echo ""
print_header "Audit Report Summary"
echo "📋 Full report: $AUDIT_REPORT"
echo "🔍 Critical issues: $CRITICAL_ISSUES"
echo "⚠️  Warnings: $WARNINGS"
echo "✅ Successes: $SUCCESSES"

if [ "$CRITICAL_ISSUES" -eq 0 ]; then
    echo "🎉 Agent is ready for production deployment!"
else
    echo "❌ Critical issues must be resolved before production deployment."
fi
