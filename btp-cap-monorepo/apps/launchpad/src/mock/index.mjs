import feMockserverCore from '@sap-ux/fe-mockserver-core'
import { YamlDocument } from '@sap-ux/yaml'
import finalHandler from 'finalhandler'
import * as fs from 'fs'
import * as http from 'http'

var basePath = process.cwd()

const FEMockserver = feMockserverCore.default
const config = new YamlDocument(fs.readFileSync('./apps/launchpad/src/mock/ui5-mock.yaml', 'utf8'))
const customMiddlewares = config
  .getNode({
    path: 'server.customMiddleware'
  })
  .toJSON()
const sapFeMockserver = customMiddlewares.find((item) => item.name === 'sap-fe-mockserver')

let server
const mockServer = new FEMockserver({
  ...sapFeMockserver.configuration,
  services: sapFeMockserver.configuration.services.map((item) => ({
    ...item,
    metadataPath: `${basePath}/${item.metadataPath}`,
    mockdataPath: `${basePath}/${item.mockdataPath}`,
  })),
  contextBasedIsolation: true
})

await mockServer.isReady.then(() => {
  server = http.createServer(function onRequest(req, res) {
    mockServer.getRouter()(req, res, finalHandler(req, res))
  })
  server.listen(3000, () => {
    console.log(`🚀 FE Mockserver running at http://localhost:3000`)
  })
})
