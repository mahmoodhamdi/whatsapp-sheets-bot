#!/bin/bash

echo "========================================"
echo "  WhatsApp Bot - Production Validation"
echo "========================================"
echo ""

# Exit on error
set -e

echo "1. Running ESLint..."
npm run lint || { echo "ESLint failed!"; exit 1; }
echo "   Lint passed."
echo ""

echo "2. Building project..."
npm run build || { echo "Build failed!"; exit 1; }
echo "   Build passed."
echo ""

echo "3. Running unit tests..."
npm run test || { echo "Unit tests failed!"; exit 1; }
echo "   Unit tests passed."
echo ""

echo "4. Running security audit..."
npm audit --audit-level=high || { echo "Security audit failed!"; exit 1; }
echo "   Security audit passed."
echo ""

echo "========================================"
echo "  All validations passed!"
echo "  Project is production ready."
echo "========================================"
