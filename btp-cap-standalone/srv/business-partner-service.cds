using { zsap.capire.bookshop as my } from '../db/schema';

@impl: 'srv/impl/business-partner/business-partner-service-handler.js'
service BupaService  {
  entity CapBusinessPartner @readonly as projection on my.CapBusinessPartner;

  function getByKey(param : String) returns CapBusinessPartner;
  function getAll() returns array of CapBusinessPartner;
}