import AuditLog from '../models/AuditLog.js';

export const logAudit = async ({
  actor,
  action,
  entityType,
  entityId,
  description,
  metadata = {},
  req,
}) => {
  try {
    await AuditLog.create({
      actor,
      action,
      entityType,
      entityId,
      description,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
  } catch (error) {
    console.error('Audit log failed:', error.message);
  }
};