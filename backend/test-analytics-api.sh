#!/bin/bash

# Analytics API Test Script
# Tests all 14 analytics endpoints with sample data

BASE_URL="http://localhost:3001/api"
TEST_USER_ID="0d21d737-353f-4b6d-b0a9-93cccb43730f"
COOKIE_FILE="test-cookies.txt"

echo "🧪 Analytics API Testing Suite"
echo "==============================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=${5:-200}

    echo -n "Testing: $name ... "

    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -b "$COOKIE_FILE" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" \
            -b "$COOKIE_FILE" \
            "$BASE_URL$endpoint")
    fi

    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code, expected $expected_status)"
        echo "Response: $body"
        ((FAILED++))
        return 1
    fi
}

# Step 1: Login to get session cookie
echo -e "${BLUE}Step 1: Authenticating...${NC}"
login_response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d '{"email":"sarah.employee@example.com","password":"password123"}' \
    "$BASE_URL/auth/login")

login_code=$(echo "$login_response" | tail -n 1)
if [ "$login_code" -eq "200" ]; then
    echo -e "${GREEN}✓ Authentication successful${NC}"
    echo ""
else
    echo -e "${RED}✗ Authentication failed (HTTP $login_code)${NC}"
    echo "Cannot proceed with tests"
    exit 1
fi

# Step 2: Create test data
echo -e "${BLUE}Step 2: Creating test analytics data...${NC}"

# Test 1: POST Performance Metrics
test_endpoint "POST /analytics/performance" "POST" "/analytics/performance" \
'{
  "userId": "'"$TEST_USER_ID"'",
  "period": "2025-10",
  "goalAchievementRate": 85,
  "workQualityScore": 90,
  "productivityEfficiency": 82,
  "engagementScore": 88,
  "overallPerformance": 86
}' 201

# Test 2: POST Skill Assessment
test_endpoint "POST /analytics/skills" "POST" "/analytics/skills" \
'{
  "userId": "'"$TEST_USER_ID"'",
  "skillAreas": [
    {
      "category": "Clinical Skills",
      "skillName": "Patient Assessment",
      "currentLevel": 70,
      "requiredLevel": 90,
      "trainingRecommendations": ["Advanced Patient Assessment Course"]
    },
    {
      "category": "Cultural Competency",
      "skillName": "Cross-Cultural Communication",
      "currentLevel": 85,
      "requiredLevel": 90,
      "trainingRecommendations": ["Cultural Sensitivity Workshop"]
    }
  ]
}' 201

# Test 3: POST Sentiment Analysis
test_endpoint "POST /analytics/sentiment" "POST" "/analytics/sentiment" \
'{
  "userId": "'"$TEST_USER_ID"'",
  "feedbackType": "survey",
  "responses": {
    "overallFeeling": 4,
    "confidence": 4,
    "topPriority": "Career growth"
  },
  "rawText": "I am feeling confident about my role and excited about career development opportunities.",
  "sentimentScore": 80,
  "analyzedThemes": ["confidence", "career development", "growth"]
}' 201

# Test 4: POST User Interaction
test_endpoint "POST /analytics/interactions" "POST" "/analytics/interactions" \
'{
  "eventType": "course_complete",
  "entityType": "course",
  "entityId": "CULT-101",
  "metadata": {
    "completionTime": 180,
    "score": 92
  }
}' 201

echo ""
echo -e "${BLUE}Step 3: Testing GET endpoints...${NC}"

# Test 5: GET Performance Metrics
test_endpoint "GET /analytics/performance/{userId}" "GET" "/analytics/performance/$TEST_USER_ID"

# Test 6: GET Skills
test_endpoint "GET /analytics/skills/{userId}" "GET" "/analytics/skills/$TEST_USER_ID"

# Test 7: GET Sentiment
test_endpoint "GET /analytics/sentiment/{userId}" "GET" "/analytics/sentiment/$TEST_USER_ID"

# Test 8: GET Retention
test_endpoint "GET /analytics/retention/{userId}" "GET" "/analytics/retention/$TEST_USER_ID"

# Test 9: GET High-Risk Employees
test_endpoint "GET /analytics/retention/high-risk" "GET" "/analytics/retention/high-risk"

# Test 10: GET Alerts
test_endpoint "GET /analytics/alerts" "GET" "/analytics/alerts"

# Test 11: GET Insights
test_endpoint "GET /analytics/insights" "GET" "/analytics/insights"

# Test 12: GET Dashboard
test_endpoint "GET /analytics/dashboard" "GET" "/analytics/dashboard?period=current-month"

# Test 13: GET Training Effectiveness (may not exist yet)
test_endpoint "GET /analytics/training/{courseId}" "GET" "/analytics/training/CULT-101"

# Test 14: GET Learner Engagement
test_endpoint "GET /analytics/training/learner/{userId}" "GET" "/analytics/training/learner/$TEST_USER_ID"

# Cleanup
rm -f "$COOKIE_FILE"

# Summary
echo ""
echo "==============================="
echo "Test Summary"
echo "==============================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed${NC}"
    exit 1
fi
