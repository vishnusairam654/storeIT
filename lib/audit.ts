type AuditEvent = {
  action: string;
  actorId: string;
  targetId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export const logAuditEvent = (event: AuditEvent) => {
  const payload = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // Structured log for later ingestion by a real logging system.
  console.log(JSON.stringify(payload));
};
