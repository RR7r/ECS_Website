const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };


/**
 * Records an administrative action. Auditing never blocks the action itself.
 */
export async function logAudit({ action, entity, title, details }) {
  try {
    const me = await db.auth.me();
    await db.entities.AuditLog.create({
      actor_email: me?.email || 'unknown',
      actor_name: me?.full_name || '',
      action,
      entity_name: entity || '',
      record_title: title || '',
      details: details || '',
    });
  } catch {
    // audit failures must not interrupt the user's action
  }
}