const cds = require('@sap/cds')

/**
 * Service implementation for the cds service defined in /srv/auth-service.cds
 * Annotation @impl is used in service definition file (.cds) to specify alternative paths (relative to srv/impl/) to load implementations from
 * Note: The name of service handler should match the cds service name
 */
export const AuthService = async (srv) => {
  srv.on('current', async (req) => {
    return {ID: req.user.id, Name: req.user.name ?? 'Anonymous'}
  })
}
