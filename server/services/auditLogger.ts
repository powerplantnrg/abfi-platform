/**
 * Audit Logging Service
 *
 * Enterprise-grade audit logging for IRAP/Essential Eight compliance.
 * Logs all security-relevant events with full context for forensic analysis.
 *
 * Compliance: ISM Control 0580, 0585, 0988
 */

import { createAuditLog, getAuditLogs as dbGetAuditLogs } from "../db";
import { ENV } from "../_core/env";

export type AuditAction =
  | "login_success"
  | "login_failed"
  | "logout"
  | "session_expired"
  | "password_change"
  | "mfa_enabled"
  | "mfa_disabled"
  | "create_user"
  | "update_user"
  | "delete_user"
  | "role_changed"
  | "permission_granted"
  | "permission_revoked"
  | "create_quote"
  | "update_quote"
  | "submit_quote"
  | "create_contract"
  | "sign_contract"
  | "cancel_contract"
  | "create_payment"
  | "complete_payment"
  | "fail_payment"
  | "upload_document"
  | "download_document"
  | "delete_document"
  | "issue_certificate"
  | "revoke_certificate"
  | "verify_certificate"
  | "create_feedstock"
  | "update_feedstock"
  | "delete_feedstock"
  | "create_supplier"
  | "update_supplier"
  | "verify_supplier"
  | "export_data"
  | "import_data"
  | "update_settings"
  | "create_api_key"
  | "revoke_api_key"
  | "suspicious_activity"
  | "access_denied"
  | "rate_limit_exceeded";

export type EntityType =
  | "user"
  | "session"
  | "quote"
  | "contract"
  | "payment"
  | "document"
  | "certificate"
  | "supplier"
  | "feedstock"
  | "settings"
  | "api_key"
  | "evidence";

export interface AuditEventData {
  userId?: number;
  action: AuditAction;
  entityType: EntityType;
  entityId: number;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  ipAddress?: string;
  userAgent?: string;
}

interface StoredAuditLog {
  id: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: number;
  changes: { before?: Record<string, unknown>; after?: Record<string, unknown> } | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

/**
 * Log an audit event to the database
 */
export async function logAuditEvent(event: AuditEventData): Promise<StoredAuditLog | null> {
  try {
    // Insert using existing db function
    await createAuditLog({
      userId: event.userId ?? null,
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId,
      changes: event.changes ?? null,
      ipAddress: event.ipAddress ?? null,
      userAgent: event.userAgent ?? null,
    });

    // Also log to console in development
    if (!ENV.isProduction) {
      console.log(
        `[AUDIT] ${event.action} on ${event.entityType}#${event.entityId} by user#${event.userId || "anonymous"}`
      );
    }

    return { ...event, id: 0, createdAt: new Date() } as StoredAuditLog;
  } catch (error) {
    console.error("[AUDIT] Failed to log audit event:", error);
    // Don't throw - audit logging should never break the main flow
    return null;
  }
}

/**
 * Express middleware to extract request context for audit logging
 */
export function extractAuditContext(req: {
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
  user?: { id?: number };
}): Partial<AuditEventData> {
  return {
    userId: req.user?.id,
    ipAddress: req.ip || getClientIp(req.headers),
    userAgent: getHeader(req.headers, "user-agent"),
  };
}

function getHeader(headers: Record<string, string | string[] | undefined> | undefined, name: string): string | undefined {
  if (!headers) return undefined;
  const value = headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function getClientIp(headers: Record<string, string | string[] | undefined> | undefined): string | undefined {
  if (!headers) return undefined;

  // Check common proxy headers
  const forwarded = getHeader(headers, "x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return getHeader(headers, "x-real-ip");
}

/**
 * Create audit log helper with pre-filled context
 */
export function createAuditLogger(context: Partial<AuditEventData>) {
  return {
    log: (event: Omit<AuditEventData, keyof typeof context> & Partial<typeof context>) =>
      logAuditEvent({ ...context, ...event } as AuditEventData),

    create: (entityType: EntityType, entityId: number, after?: Record<string, unknown>) =>
      logAuditEvent({
        ...context,
        action: `create_${entityType}` as AuditAction,
        entityType,
        entityId,
        changes: after ? { after } : undefined,
      } as AuditEventData),

    update: (entityType: EntityType, entityId: number, before?: Record<string, unknown>, after?: Record<string, unknown>) =>
      logAuditEvent({
        ...context,
        action: `update_${entityType}` as AuditAction,
        entityType,
        entityId,
        changes: { before, after },
      } as AuditEventData),

    delete: (entityType: EntityType, entityId: number, before?: Record<string, unknown>) =>
      logAuditEvent({
        ...context,
        action: `delete_${entityType}` as AuditAction,
        entityType,
        entityId,
        changes: before ? { before } : undefined,
      } as AuditEventData),
  };
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(filters: {
  userId?: number;
  entityType?: EntityType;
  entityId?: number;
  limit?: number;
}): Promise<{ logs: StoredAuditLog[]; total: number }> {
  const logs = await dbGetAuditLogs({
    userId: filters.userId,
    entityType: filters.entityType,
    entityId: filters.entityId,
    limit: filters.limit || 100,
  });

  return { logs: logs as StoredAuditLog[], total: logs.length };
}

export default {
  log: logAuditEvent,
  extractContext: extractAuditContext,
  createLogger: createAuditLogger,
  query: queryAuditLogs,
};
