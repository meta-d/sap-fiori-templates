import cds from '@sap/cds'

/**
 * Service implementation for the cds service defined in /srv/risk-service.cds
 *
 */
export default cds.service.impl(async function () {
  const bupa = await cds.connect.to('API_BUSINESS_PARTNER')

  /**
   * delegate request to the remote service
   */
  this.on('READ', 'Suppliers', async (req) => {
    return bupa.run(req.query)
  })

  // Risks?$expand=supplier
  this.on('READ', 'Risks', async (req, next) => {
    if (!req.query.SELECT.columns) return next()
    const expandIndex = req.query.SELECT.columns.findIndex(({ expand, ref }) => expand && ref[0] === 'supplier')
    if (expandIndex < 0) return next()

    // Remove expand from query
    req.query.SELECT.columns.splice(expandIndex, 1)

    // Make sure supplier_ID will be returned
    if (
      !(req.query.SELECT.columns.indexOf('*') >= 0) &&
      !req.query.SELECT.columns.find((column) => column.ref && column.ref.find((ref) => ref == 'supplier_ID'))
    ) {
      req.query.SELECT.columns.push({ ref: ['supplier_ID'] })
    }

    const risks = await next()

    const asArray = (x) => (Array.isArray(x) ? x : [x])

    // Request all associated suppliers
    const supplierIds = asArray(risks).map((risk) => risk.supplier_ID)
    const suppliers = await bupa.run(SELECT.from('RiskService.Suppliers').where({ ID: supplierIds }))

    // Convert in a map for easier lookup
    const suppliersMap = {}
    for (const supplier of suppliers) suppliersMap[supplier.ID] = supplier

    // Add suppliers to result
    for (const note of asArray(risks)) {
      note.supplier = suppliersMap[note.supplier_ID]
    }

    return risks
  })

  this.after('READ', 'Risks', (risksData) => {})
})
