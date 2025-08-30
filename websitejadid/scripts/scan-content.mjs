#!/usr/bin/env node

/**
 * Content Safety Scanner for ViWorkS
 * Prevents accidental disclosure of sensitive technical information
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Forbidden patterns that indicate sensitive information
const FORBIDDEN_PATTERNS = [
  // Port numbers
  /:\d{2,5}/g,
  
  // IP addresses
  /\b(?:10\.|172\.(?:1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)\d+\.\d+/g,
  /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  
  // VPN/Network protocols
  /\b(?:openvpn|stunnel|wireguard|ipsec|ike)\b/gi,
  
  // Specific ciphers
  /\b(?:aes-256-gcm|chacha20-poly1305|ed25519|rsa-4096)\b/gi,
  
  // Infrastructure terms
  /\b(?:gateway|backend|pki|siem|kms|hsm)\b/gi,
  
  // Configuration patterns
  /\b(?:config|conf|\.env|\.toml|\.yaml|\.yml)\b/gi,
  
  // Log patterns
  /\b(?:log|debug|trace|error)\b/gi,
  
  // Version numbers (specific)
  /\b(?:v?\d+\.\d+\.\d+)\b/g,
  
  // File paths that might be sensitive
  /\b(?:\/etc\/|\/var\/|\/usr\/|\/home\/|\/root\/)\b/gi,
  
  // Database connection strings
  /\b(?:postgresql|mysql|mongodb|redis):\/\//gi,
  
  // API keys/tokens
  /\b(?:api_key|access_token|secret_key|private_key)\b/gi,
];

// Directories to scan
const SCAN_DIRECTORIES = [
  'content',
  'app',
  'components',
];

// File extensions to scan
const SCAN_EXTENSIONS = [
  '.md',
  '.mdx',
  '.tsx',
  '.ts',
  '.jsx',
  '.js',
];

// Files to exclude
const EXCLUDE_FILES = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
];

let hasViolations = false;
const violations = [];

function shouldScanFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return SCAN_EXTENSIONS.includes(ext);
}

function shouldExcludeFile(filePath) {
  return EXCLUDE_FILES.some(exclude => filePath.includes(exclude));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineNumber) => {
      FORBIDDEN_PATTERNS.forEach((pattern, patternIndex) => {
        const matches = line.match(pattern);
        if (matches) {
          hasViolations = true;
          violations.push({
            file: filePath,
            line: lineNumber + 1,
            pattern: pattern.toString(),
            matches: matches,
            content: line.trim(),
          });
        }
      });
    });
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!shouldExcludeFile(fullPath)) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile() && shouldScanFile(fullPath)) {
        scanFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

function main() {
  console.log('🔍 Scanning content for sensitive information...\n');
  
  const projectRoot = path.resolve(__dirname, '..');
  
  SCAN_DIRECTORIES.forEach(dir => {
    const dirPath = path.join(projectRoot, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`Scanning ${dir}/...`);
      scanDirectory(dirPath);
    }
  });
  
  if (hasViolations) {
    console.log('\n❌ CONTENT SAFETY VIOLATIONS FOUND:\n');
    
    violations.forEach((violation, index) => {
      console.log(`${index + 1}. File: ${violation.file}`);
      console.log(`   Line: ${violation.line}`);
      console.log(`   Pattern: ${violation.pattern}`);
      console.log(`   Matches: ${violation.matches.join(', ')}`);
      console.log(`   Content: "${violation.content}"`);
      console.log('');
    });
    
    console.log('🚨 Please review and remove sensitive information before deployment.');
    process.exit(1);
  } else {
    console.log('✅ No content safety violations found.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
