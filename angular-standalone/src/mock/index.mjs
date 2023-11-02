import feMockserverCore from '@sap-ux/fe-mockserver-core';
import finalHandler from 'finalhandler';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

const FEMockserver = feMockserverCore.default

const __dirname = './src/mock'
let server
const mockServer = new FEMockserver({
    services: [
        {
            metadataPath: path.join(__dirname, 'odata', 'ESH_SEARCH_SRV', 'metadata.xml'),
            mockdataPath: path.join(__dirname, 'odata', 'ESH_SEARCH_SRV', 'mockdata'),
            urlPath: '/sap/opu/odata/sap/ESH_SEARCH_SRV',
            debug: true,
            watch: true
        },
    ],
    annotations: [
    ],
    contextBasedIsolation: true,
});

await mockServer.isReady.then(() => {
    server = http.createServer(function onRequest(req, res) {
        mockServer.getRouter()(req, res, finalHandler(req, res));
    });
    server.listen(3000);
})
