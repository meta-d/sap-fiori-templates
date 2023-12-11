import { epmRefAppsProd as productService } from '../generated/epm-ref-apps-prod';
const { productsApi } = productService();

/**
 * Service implementation for the cds service defined in /srv/business-partner-service.cds
 * Annotation @impl is used in service definition file (.cds) to specify alternative paths (relative to dist/) to load implementations from
 * Note: The name of service handler should match the cds service name
 */
export const ProductService = (srv) => {
  srv.on('getByKey', async (oRequest) => {
    const param = oRequest.data.param;
    const partner = await productsApi
      .requestBuilder()
      .getByKey(param)
      .execute({ destinationName: 'ES5' });
    oRequest.reply(partner);
  });

  srv.on('getAll', async (oRequest) => {
    const partners = await productsApi
      .requestBuilder()
      .getAll()
      .top(5)
      .execute({ destinationName: 'ES5' });
    console.log(partners)
    oRequest.reply(partners.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[upperFirst(key)] = item[key];
        return acc
      }, {})
    ));
  });
};

// Implement upperFirst
function upperFirst(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}
