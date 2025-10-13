// Refactored to use backend API instead of direct database access
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface WaitlistEntry {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profession?: string;
  yearsOfExperience?: number;
  interestedServices?: string[];
  message?: string;
  referralSource?: string;
}

export interface WaitlistFilter {
  status?: string;
  confirmedEmail?: boolean;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

/**
 * Add a new entry to the waitlist
 */
export async function addToWaitlist(entry: WaitlistEntry) {
  try {
    const response = await fetch(`${API_URL}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(entry),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to add to waitlist' };
    }

    return data;
  } catch (error: any) {
    console.error('Error adding to waitlist:', error);
    return { success: false, error: 'Failed to add to waitlist' };
  }
}

/**
 * Get all waitlist entries with optional filtering (admin only)
 */
export async function getWaitlistEntries(filter: WaitlistFilter = {}) {
  try {
    const params = new URLSearchParams();

    if (filter.status) params.append('status', filter.status);
    if (filter.confirmedEmail !== undefined) params.append('confirmedEmail', String(filter.confirmedEmail));
    if (filter.searchTerm) params.append('searchTerm', filter.searchTerm);
    if (filter.limit) params.append('limit', String(filter.limit));
    if (filter.offset) params.append('offset', String(filter.offset));

    const response = await fetch(`${API_URL}/waitlist?${params}`, {
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch waitlist entries' };
    }

    return data;
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    return { success: false, error: 'Failed to fetch waitlist entries' };
  }
}

/**
 * Get a single waitlist entry by ID (admin only)
 */
export async function getWaitlistEntry(id: string) {
  try {
    const response = await fetch(`${API_URL}/waitlist/${id}`, {
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Entry not found' };
    }

    return data;
  } catch (error) {
    console.error('Error fetching waitlist entry:', error);
    return { success: false, error: 'Failed to fetch waitlist entry' };
  }
}

/**
 * Update waitlist entry status (admin only)
 */
export async function updateWaitlistStatus(
  id: string,
  status: string,
  adminUserId?: string,
  ipAddress?: string
) {
  try {
    const response = await fetch(`${API_URL}/waitlist/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update status' };
    }

    return data;
  } catch (error) {
    console.error('Error updating waitlist status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

/**
 * Update waitlist entry notes (admin only)
 */
export async function updateWaitlistNotes(
  id: string,
  notes: string,
  adminUserId?: string,
  ipAddress?: string
) {
  try {
    const response = await fetch(`${API_URL}/waitlist/${id}/notes`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ notes }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to update notes' };
    }

    return data;
  } catch (error) {
    console.error('Error updating waitlist notes:', error);
    return { success: false, error: 'Failed to update notes' };
  }
}

/**
 * Confirm email with token
 */
export async function confirmEmail(token: string) {
  try {
    const response = await fetch(`${API_URL}/waitlist/confirm/${token}`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Invalid confirmation token' };
    }

    return data;
  } catch (error) {
    console.error('Error confirming email:', error);
    return { success: false, error: 'Failed to confirm email' };
  }
}

/**
 * Get waitlist statistics (admin only)
 */
export async function getWaitlistStats() {
  try {
    const response = await fetch(`${API_URL}/waitlist/stats/summary`, {
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch statistics' };
    }

    return data;
  } catch (error) {
    console.error('Error fetching waitlist stats:', error);
    return { success: false, error: 'Failed to fetch statistics' };
  }
}

/**
 * Get audit log for a waitlist entry (admin only)
 */
export async function getWaitlistAuditLog(waitlistId: string) {
  try {
    const response = await fetch(`${API_URL}/waitlist/${waitlistId}/audit-log`, {
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to fetch audit log' };
    }

    return data;
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return { success: false, error: 'Failed to fetch audit log' };
  }
}

/**
 * Export waitlist to CSV format (admin only)
 */
export async function exportWaitlistToCSV(filter: WaitlistFilter = {}) {
  const result = await getWaitlistEntries({ ...filter, limit: undefined, offset: undefined });

  if (!result.success || !result.data) {
    return { success: false, error: 'Failed to fetch waitlist data' };
  }

  const headers = [
    'Email',
    'First Name',
    'Last Name',
    'Phone',
    'Profession',
    'Years of Experience',
    'Interested Services',
    'Status',
    'Signup Date',
    'Email Confirmed',
    'Referral Source',
  ];

  const rows = result.data.map((entry: any) => [
    entry.email,
    entry.firstName || '',
    entry.lastName || '',
    entry.phone || '',
    entry.profession || '',
    entry.yearsOfExperience || '',
    Array.isArray(entry.interestedServices) ? entry.interestedServices.join('; ') : '',
    entry.status,
    new Date(entry.signupDate).toLocaleDateString(),
    entry.confirmedEmail ? 'Yes' : 'No',
    entry.referralSource || '',
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return { success: true, data: csv };
}

/**
 * Delete a waitlist entry (soft delete by changing status to 'removed')
 */
export async function removeFromWaitlist(
  id: string,
  adminUserId?: string,
  ipAddress?: string
) {
  return updateWaitlistStatus(id, 'removed', adminUserId, ipAddress);
}
