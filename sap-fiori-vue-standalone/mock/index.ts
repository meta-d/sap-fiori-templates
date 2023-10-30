import * as fs from 'fs';
import { MockMethod } from 'vite-plugin-mock';

const odataMockList = [] as MockMethod[];

[
  {
    service: 'EPM_REF_APPS_PO_APV_SRV',
    entitySets: ['PurchaseOrders', 'Suppliers'],
  },
  {
    service: 'ESH_SEARCH_SRV',
    entitySets: [
      {
        name: 'Users',
        key: 'current',
      },
    ],
  },
].forEach(({ service, entitySets }) => {
  odataMockList.push({
    url: `/sap/opu/odata/sap/${service}/$metadata`,
    method: 'get',
    rawResponse: async (req, res) => {
      res.setHeader('Content-Type', 'text/xml');
      res.statusCode = 200;
      res.end(fs.readFileSync(`./mock/${service}/metadata.xml`, 'utf8'));
    },
  });

  entitySets.forEach((entity) => {
    let url = `/sap/opu/odata/sap/${service}/`
    if (typeof entity === 'string') {
      url += `${entity}`
    } else {
      url += `${entity.name}\\('${entity.key}'\\)`
    }
    odataMockList.push({
      url,
      method: 'get',
      response: ({ query }) => {
        console.log(query)
        if (typeof entity === 'string') {
          return {
            d: {
              results: JSON.parse(
                fs.readFileSync(
                  `./mock/${service}/${entity}/items.json`,
                  'utf8'
                )
              ),
            },
          };
        } else {
          return {
            d: JSON.parse(
              fs.readFileSync(`./mock/${service}/${entity.name}/${entity.key}.json`, 'utf8')
            ),
          };
        }
      },
    });
  });
});

export default [
  ...odataMockList,
  {
    url: '/api/post',
    method: 'post',
    timeout: 2000,
    response: {
      code: 0,
      data: {
        name: 'vben',
      },
    },
  },
  {
    url: '/api/text',
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = '';
      await new Promise((resolve) => {
        req.on('data', (chunk) => {
          reqbody += chunk;
        });
        req.on('end', () => resolve(undefined));
      });
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.end(`hello, ${reqbody}`);
    },
  },
] as MockMethod[];
