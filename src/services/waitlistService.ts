import { db } from '@/db';
import { waitlist, waitlistAuditLog } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';

// Browser-compatible random token generator
function generateToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

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
  ipAddress?: string;
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
  // Generate confirmation token
  const confirmationToken = generateToken(32);

  try {
    const result = await db.insert(waitlist).values({
      ...entry,
      interestedServices: entry.interestedServices as any,
      confirmationToken,
      status: 'waitlisted',
      confirmedEmail: false,
    }).returning();

    return { success: true, data: result[0] };
  } catch (error: any) {
    // Check for duplicate email
    if (error.code === '23505') { // PostgreSQL unique violation
      return { success: false, error: 'Email already exists on waitlist' };
    }
    console.error('Error adding to waitlist:', error);
    return { success: false, error: 'Failed to add to waitlist' };
  }
}

/**
 * Get all waitlist entries with optional filtering
 */
export async function getWaitlistEntries(filter: WaitlistFilter = {}) {
  try {
    let query = db.select().from(waitlist);

    // Apply filters
    const conditions = [];
    if (filter.status) {
      conditions.push(eq(waitlist.status, filter.status));
    }
    if (filter.confirmedEmail !== undefined) {
      conditions.push(eq(waitlist.confirmedEmail, filter.confirmedEmail));
    }
    if (filter.searchTerm) {
      const searchPattern = `%${filter.searchTerm}%`;
      conditions.push(
        sql`(${waitlist.email} ILIKE ${searchPattern} OR ${waitlist.firstName} ILIKE ${searchPattern} OR ${waitlist.lastName} ILIKE ${searchPattern})`
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(desc(waitlist.signupDate)) as any;

    if (filter.limit) {
      query = query.limit(filter.limit) as any;
    }
    if (filter.offset) {
      query = query.offset(filter.offset) as any;
    }

    const results = await query;
    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching waitlist entries:', error);
    return { success: false, error: 'Failed to fetch waitlist entries' };
  }
}

/**
 * Get a single waitlist entry by ID
 */
export async function getWaitlistEntry(id: string) {
  try {
    const result = await db.select().from(waitlist).where(eq(waitlist.id, id));
    if (result.length === 0) {
      return { success: false, error: 'Entry not found' };
    }
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error fetching waitlist entry:', error);
    return { success: false, error: 'Failed to fetch waitlist entry' };
  }
}

/**
 * Update waitlist entry status
 */
export async function updateWaitlistStatus(
  id: string,
  status: string,
  adminUserId?: string,
  ipAddress?: string
) {
  try {
    // Get current entry
    const current = await db.select().from(waitlist).where(eq(waitlist.id, id));
    if (current.length === 0) {
      return { success: false, error: 'Entry not found' };
    }

    const previousStatus = current[0].status;

    // Update status
    const contactedAt = status === 'contacted' ? new Date() : current[0].contactedAt;
    const result = await db
      .update(waitlist)
      .set({
        status,
        contactedAt,
        updatedAt: new Date(),
      })
      .where(eq(waitlist.id, id))
      .returning();

    // Log the change
    await db.insert(waitlistAuditLog).values({
      waitlistId: id,
      adminUserId,
      action: 'status_change',
      previousValue: previousStatus,
      newValue: status,
      ipAddress,
    });

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error updating waitlist status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

/**
 * Update waitlist entry notes
 */
export async function updateWaitlistNotes(
  id: string,
  notes: string,
  adminUserId?: string,
  ipAddress?: string
) {
  try {
    // Get current entry
    const current = await db.select().from(waitlist).where(eq(waitlist.id, id));
    if (current.length === 0) {
      return { success: false, error: 'Entry not found' };
    }

    const previousNotes = current[0].notes;

    // Update notes
    const result = await db
      .update(waitlist)
      .set({
        notes,
        updatedAt: new Date(),
      })
      .where(eq(waitlist.id, id))
      .returning();

    // Log the change
    await db.insert(waitlistAuditLog).values({
      waitlistId: id,
      adminUserId,
      action: 'note_added',
      previousValue: previousNotes || '',
      newValue: notes,
      ipAddress,
    });

    return { success: true, data: result[0] };
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
    const result = await db
      .update(waitlist)
      .set({
        confirmedEmail: true,
        updatedAt: new Date(),
      })
      .where(eq(waitlist.confirmationToken, token))
      .returning();

    if (result.length === 0) {
      return { success: false, error: 'Invalid confirmation token' };
    }

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error confirming email:', error);
    return { success: false, error: 'Failed to confirm email' };
  }
}

/**
 * Get waitlist statistics
 */
export async function getWaitlistStats() {
  try {
    const [total, confirmed, contacted, registered] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(waitlist),
      db.select({ count: sql<number>`count(*)` }).from(waitlist).where(eq(waitlist.confirmedEmail, true)),
      db.select({ count: sql<number>`count(*)` }).from(waitlist).where(eq(waitlist.status, 'contacted')),
      db.select({ count: sql<number>`count(*)` }).from(waitlist).where(eq(waitlist.status, 'registered')),
    ]);

    return {
      success: true,
      data: {
        total: Number(total[0].count),
        confirmed: Number(confirmed[0].count),
        contacted: Number(contacted[0].count),
        registered: Number(registered[0].count),
      },
    };
  } catch (error) {
    console.error('Error fetching waitlist stats:', error);
    return { success: false, error: 'Failed to fetch statistics' };
  }
}

/**
 * Get audit log for a waitlist entry
 */
export async function getWaitlistAuditLog(waitlistId: string) {
  try {
    const results = await db
      .select()
      .from(waitlistAuditLog)
      .where(eq(waitlistAuditLog.waitlistId, waitlistId))
      .orderBy(desc(waitlistAuditLog.timestamp));

    return { success: true, data: results };
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return { success: false, error: 'Failed to fetch audit log' };
  }
}

/**
 * Export waitlist to CSV format
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
