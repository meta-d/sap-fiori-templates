using { EPM_REF_APPS_PROD_MAN as my } from './external/EPM_REF_APPS_PROD_MAN';

@impl: 'srv/impl/product/product-service-handler.js'
service ProductService  {
  entity Products @readonly as projection on my.Products;

  function getByKey(param : String) returns Products;
  function getAll() returns array of Products;
}