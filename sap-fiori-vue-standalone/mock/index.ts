import * as fs from 'fs';
import { MockMethod } from 'vite-plugin-mock';

export default [
  {
    url: '/sap/opu/odata/sap/EPM_REF_APPS_SHOP_SRV/Products',
    method: 'get',
    response: ({ query }) => {
      return {
        d: {
          results: [
            {
              AverageRating: 3,
              Name: 'Power Projector 4713',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Gladiator MX',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Hurricane GX',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Webcam Pro',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Webcam',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Case',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Bag',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Case',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Bag',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Case',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Bag',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Case',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Bag',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Case',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Bag',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Case',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Bag',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Case',
              StockQuantity: 10,
            },
            {
              AverageRating: 3,
              Name: 'Laptop Bag',
              StockQuantity: 10,
            },
          ],
        },
      };
    },
  },
  {
    url: '/sap/opu/odata/sap/EPM_REF_APPS_PO_APV_SRV/$metadata',
    method: 'get',
    rawResponse: async (req, res) => {
      res.setHeader('Content-Type', 'text/xml');
      res.statusCode = 200;
      res.end(fs.readFileSync('./mock/metadata/po.xml', 'utf8'));
    },
  },
  ...['PurchaseOrders', 'Suppliers'].map((entity) => {
    return {
      url: '/sap/opu/odata/sap/EPM_REF_APPS_PO_APV_SRV/' + entity,
      method: 'get',
      response: ({ query }) => {
        console.log(query)
        return {
          d: {
            results: JSON.parse(fs.readFileSync('./mock/'+entity+'/items.json', 'utf8')),
          },
        };
      },
    }
  }),
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
