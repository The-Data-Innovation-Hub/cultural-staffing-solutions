#!/bin/bash

# Production Deployment Test Script
# Tests your deployed application on Render and Vercel

BACKEND_URL="https://css-clinify.onrender.com"
FRONTEND_URL="https://cultural-staffing-solutions.vercel.app"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing Production Deployment${NC}"
echo "=========================================="
echo -e "Backend:  ${BACKEND_URL}"
echo -e "Frontend: ${FRONTEND_URL}"
echo ""

# Test Backend
echo -e "${BLUE}━━━ Backend Tests ━━━${NC}"
echo ""

echo -n "Testing health endpoint... "
if curl -f -s "${BACKEND_URL}/api/health" > /dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}"
    curl -s "${BACKEND_URL}/api/health" | jq . | sed 's/^/  /'
else
    echo -e "${RED}✗ FAILED${NC}"
fi
echo ""

echo -n "Testing Swagger JSON endpoint... "
if curl -f -s "${BACKEND_URL}/api-docs.json" > /dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}"
    TITLE=$(curl -s "${BACKEND_URL}/api-docs.json" | jq -r '.info.title')
    VERSION=$(curl -s "${BACKEND_URL}/api-docs.json" | jq -r '.info.version')
    echo -e "  Title: ${TITLE}"
    echo -e "  Version: ${VERSION}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi
echo ""

echo -n "Testing analytics dashboard endpoint... "
RESPONSE=$(curl -s -w "%{http_code}" "${BACKEND_URL}/api/analytics/dashboard?period=current-month")
HTTP_CODE=$(echo "$RESPONSE" | tail -c 4)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (HTTP $HTTP_CODE)"
    echo -e "  ${YELLOW}Note: 401 is expected if not authenticated${NC}"
else
    echo -e "${RED}✗ FAILED${NC} (HTTP $HTTP_CODE)"
fi
echo ""

# Test Frontend
echo -e "${BLUE}━━━ Frontend Tests ━━━${NC}"
echo ""

echo -n "Testing frontend loads... "
if curl -f -s "${FRONTEND_URL}" > /dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${BLUE}📋 Deployment Summary${NC}"
echo "=========================================="
echo ""
echo -e "${GREEN}Backend URLs:${NC}"
echo "  Health:    ${BACKEND_URL}/api/health"
echo "  Swagger:   ${BACKEND_URL}/api-docs"
echo "  API:       ${BACKEND_URL}/api"
echo ""
echo -e "${GREEN}Frontend URL:${NC}"
echo "  App:       ${FRONTEND_URL}"
echo "  Admin:     ${FRONTEND_URL}/admin"
echo "  API Docs:  ${FRONTEND_URL}/admin/api-docs"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Open ${BACKEND_URL}/api-docs in browser"
echo "  2. Open ${FRONTEND_URL} in browser"
echo "  3. Test login functionality"
echo "  4. Navigate to Admin → API Documentation"
echo ""
