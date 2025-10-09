// Email API configuration - Backend server handles all Resend API calls
const API_BASE_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001';

/**
 * Check if email service is configured
 */
export async function isEmailConfigured(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.emailConfigured || false;
  } catch (error) {
    console.error('Error checking email configuration:', error);
    return false;
  }
}

/**
 * Send simple waitlist welcome email (no verification needed)
 */
export async function sendWaitlistWelcomeEmail(
  to: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/waitlist-welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error sending welcome email:', data);
      return { success: false, error: data.error || 'Failed to send email' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send welcome email after email confirmation
 */
export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error sending welcome email:', data);
      return { success: false, error: data.error || 'Failed to send email' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send notification to admin when someone joins waitlist
 */
export async function sendAdminNotification(
  waitlistEntry: {
    email: string;
    firstName?: string;
    lastName?: string;
    profession?: string;
    interestedServices?: string[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emails/admin-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(waitlistEntry),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error sending admin notification:', data);
      return { success: false, error: data.error || 'Failed to send email' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}
