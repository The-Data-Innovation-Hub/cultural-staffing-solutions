# Email Service Setup

## Overview
The email service uses Resend.com to send transactional emails. Due to CORS restrictions, emails are sent through a backend Express server that acts as a proxy.

## Architecture
```
Frontend (React)  →  Backend API (Express)  →  Resend API  →  Email Delivery
Port 8080             Port 3001                 (External)
```

## Setup Instructions

### 1. Environment Configuration
Ensure your `.env` file has the following variables:
```bash
# Resend Email Service Configuration
VITE_RESEND_API_KEY=re_your_api_key_here
VITE_FROM_EMAIL=your-verified@email.com
VITE_ADMIN_EMAIL=admin@yourdomain.com
VITE_APP_URL=http://localhost:8080

# Optional: Override email API URL (defaults to http://localhost:3001)
VITE_EMAIL_API_URL=http://localhost:3001
```

### 2. Resend.com Setup
1. Sign up at https://resend.com
2. Get your API key from https://resend.com/api-keys
3. **Important**: Domain Verification
   - **For Development/Testing**: Use `onboarding@resend.dev` as your FROM_EMAIL (Resend's test domain)
   - **For Production**: Verify your custom domain at https://resend.com/domains
4. Update `VITE_FROM_EMAIL` in your `.env` file:
   - Development: `VITE_FROM_EMAIL=onboarding@resend.dev`
   - Production: `VITE_FROM_EMAIL=noreply@yourdomain.com` (after verification)

### 3. Running the Application

**Option 1: Run both servers separately (Recommended for development)**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend Email API
npm run server
```

**Option 2: Run both together**
```bash
npm run dev:all
```

## Email Types

### 1. Waitlist Confirmation Email
- **Trigger**: User submits waitlist form
- **Purpose**: Verify email address
- **Contains**: Confirmation link with token
- **Route**: `GET /confirm-email?token={token}`

### 2. Welcome Email
- **Trigger**: User confirms email address
- **Purpose**: Welcome user to waitlist
- **Contains**: Information about next steps and programs

### 3. Admin Notification
- **Trigger**: New waitlist signup
- **Purpose**: Notify admin of new candidate
- **Contains**: Candidate details and link to admin dashboard

## API Endpoints

### Health Check
```bash
GET http://localhost:3001/health
```
Response:
```json
{
  "status": "ok",
  "emailConfigured": true
}
```

### Send Confirmation Email
```bash
POST http://localhost:3001/api/emails/waitlist-confirmation
Content-Type: application/json

{
  "to": "user@example.com",
  "name": "John Doe",
  "confirmationToken": "abc123..."
}
```

### Send Welcome Email
```bash
POST http://localhost:3001/api/emails/welcome
Content-Type: application/json

{
  "to": "user@example.com",
  "name": "John Doe"
}
```

### Send Admin Notification
```bash
POST http://localhost:3001/api/emails/admin-notification
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profession": "nurse",
  "interestedServices": ["training", "recruitment"]
}
```

## Email Workflow

### User Journey:
1. User fills out waitlist form on landing page
2. Form submission:
   - Creates database entry with confirmation token
   - Sends confirmation email to user
   - Sends notification to admin
3. User clicks confirmation link in email
4. System verifies token and marks email as confirmed
5. Welcome email sent to user

### Error Handling:
- If email service is not configured, operations fail gracefully
- Frontend shows error messages to user
- Backend logs errors for debugging
- Database operations are atomic (all or nothing)

## Troubleshooting

### Issue: CORS errors in browser console
**Solution**: Make sure the backend server is running on port 3001

### Issue: "Email service not configured" error
**Solution**:
1. Check that `VITE_RESEND_API_KEY` is set in `.env`
2. Verify API key is valid (not 'your-resend-api-key-here')
3. Restart the backend server after changing `.env`

### Issue: Emails not sending
**Solution**:
1. Verify sender email is verified in Resend dashboard
2. Check backend server logs for errors
3. Test the health endpoint: `curl http://localhost:3001/health`

### Issue: "Failed to send email" on frontend
**Solution**:
1. Check that backend server is running
2. Verify `VITE_EMAIL_API_URL` points to correct backend URL
3. Check browser network tab for failed API calls
4. Review backend server logs for error details

### Issue: "You can only send testing emails to your own email address"
**Solution**:
This is a Resend limitation when using `onboarding@resend.dev` (test domain):
- **Limitation**: Can only send to the email address associated with your Resend account
- **For Testing**: Use your Resend account email as the recipient
- **For Production**: Verify and use your own domain to send to any email address

## Testing Emails

### Test with curl:
```bash
# Test confirmation email
curl -X POST http://localhost:3001/api/emails/waitlist-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "name": "Test User",
    "confirmationToken": "test-token-123"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "data": {
    "id": "email-id-from-resend"
  }
}
```

## Production Deployment

### Environment Variables for Production:
```bash
VITE_RESEND_API_KEY=your_production_api_key
VITE_FROM_EMAIL=noreply@yourdomain.com
VITE_ADMIN_EMAIL=admin@yourdomain.com
VITE_APP_URL=https://yourdomain.com
VITE_EMAIL_API_URL=https://api.yourdomain.com
```

### Deployment Considerations:
1. Deploy backend API to a server or serverless platform
2. Update `VITE_EMAIL_API_URL` to production backend URL
3. Ensure CORS configuration allows your production domain
4. Use environment-specific API keys
5. Monitor email delivery through Resend dashboard

## Security Notes

- API keys are kept in `.env` file (not committed to git)
- Backend validates all requests before sending emails
- Email service checks for valid API key before initializing
- CORS restricts API access to specified origins only
- Confirmation tokens are cryptographically random (32 bytes)

## Support

For issues with:
- **Resend API**: https://resend.com/docs
- **Email delivery**: Check Resend dashboard logs
- **Application errors**: Check backend server console output
