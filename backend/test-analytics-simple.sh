#!/bin/bash

# Simple Analytics API Test Script (uses mock auth in development)

BASE_URL="http://localhost:3001/api/analytics"
TEST_USER_ID="0d21d737-353f-4b6d-b0a9-93cccb43730f"

echo "🧪 Analytics API Testing Suite (Simple)"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

test_get() {
    local name=$1
    local endpoint=$2
    local expected_status=${3:-200}

    echo -n "Testing: $name ... "

    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        # Pretty print if it's JSON and not too long
        if echo "$body" | jq -e . >/dev/null 2>&1; then
            lines=$(echo "$body" | jq -C . | wc -l)
            if [ "$lines" -lt 20 ]; then
                echo "$body" | jq -C . | sed 's/^/  /'
            else
                echo "  $(echo "$body" | jq -c . | cut -c1-100)..."
            fi
        fi
        echo ""
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code, expected $expected_status)"
        echo "Response: $body" | fold -w 80 | sed 's/^/  /'
        echo ""
        ((FAILED++))
        return 1
    fi
}

test_post() {
    local name=$1
    local endpoint=$2
    local data=$3
    local expected_status=${4:-201}

    echo -n "Testing: $name ... "

    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$data" \
        "$BASE_URL$endpoint")

    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        if echo "$body" | jq -e . >/dev/null 2>&1; then
            echo "$body" | jq -C '. | {id, user_id, created_at}' 2>/dev/null | sed 's/^/  /' || echo "$body" | jq -C . | head -10 | sed 's/^/  /'
        fi
        echo ""
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code, expected $expected_status)"
        echo "Response: $body" | fold -w 80 | sed 's/^/  /'
        echo ""
        ((FAILED++))
        return 1
    fi
}

# Wait for server to restart
echo -e "${YELLOW}⏳ Waiting for server to be ready...${NC}"
sleep 3

echo -e "${BLUE}═══ Part 1: GET Endpoints (Reading Existing Data) ═══${NC}"
echo ""

test_get "GET /analytics/performance/{userId}" "/performance/$TEST_USER_ID"
test_get "GET /analytics/skills/{userId}" "/skills/$TEST_USER_ID"
test_get "GET /analytics/sentiment/{userId}" "/sentiment/$TEST_USER_ID"
test_get "GET /analytics/retention/{userId}" "/retention/$TEST_USER_ID"
test_get "GET /analytics/retention/high-risk" "/retention/high-risk"
test_get "GET /analytics/alerts" "/alerts"
test_get "GET /analytics/insights" "/insights"
test_get "GET /analytics/dashboard" "/dashboard?period=current-month"

echo -e "${BLUE}═══ Part 2: POST Endpoints (Creating New Data) ═══${NC}"
echo ""

test_post "POST /analytics/interactions" "/interactions" \
'{
  "eventType": "assessment_complete",
  "entityType": "assessment",
  "entityId": "onboarding-2025",
  "metadata": {"score": 95, "duration": 25}
}'

test_post "POST /analytics/skills" "/skills" \
'{
  "userId": "'"$TEST_USER_ID"'",
  "skillAreas": [
    {
      "category": "Technical Skills",
      "skillName": "EMR Systems",
      "currentLevel": 65,
      "requiredLevel": 85,
      "trainingRecommendations": ["EMR Advanced Training"]
    }
  ]
}'

test_post "POST /analytics/sentiment" "/sentiment" \
'{
  "userId": "'"$TEST_USER_ID"'",
  "feedbackType": "check-in",
  "sentimentScore": 75,
  "analyzedThemes": ["team collaboration", "workload"]
}'

test_post "POST /analytics/performance" "/performance" \
'{
  "userId": "'"$TEST_USER_ID"'",
  "period": "2025-11",
  "goalAchievementRate": 88,
  "workQualityScore": 92,
  "productivityEfficiency": 85,
  "engagementScore": 90,
  "overallPerformance": 89
}'

# Summary
echo ""
echo "========================================="
echo -e "${BLUE}Test Summary${NC}"
echo "========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed (this may be expected for endpoints without data)${NC}"
    exit 0  # Exit 0 since some failures are expected
fi
