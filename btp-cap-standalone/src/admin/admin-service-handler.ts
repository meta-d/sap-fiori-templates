const cds = require("@sap/cds");

/**
 * Service implementation for the cds service defined in /srv/admin-service.cds
 * Annotation @impl is used in service definition file (.cds) to specify alternative paths (relative to srv/impl/) to load implementations from
 * Note: The name of service handler should match the cds service name
 */
export const AdminService = async (srv) => {
  const bupa = await cds.connect.to("API_BUSINESS_PARTNER");

  srv.on("READ", "Suppliers", async (oRequest) => {
    return bupa.run(oRequest.query);
  });
};
