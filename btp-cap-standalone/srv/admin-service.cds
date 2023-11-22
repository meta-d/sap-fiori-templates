using {zsap.capire as my} from '../db/schema';

@impl: 'srv/impl/admin/admin-service-handler.js'
service AdminService @(
  requires: 'authenticated-user',
  path    : '/admin'
) {
  entity Books as projection on my.Books;

  entity Authors @(restrict: [{
    grant: [
      'READ',
      'WRITE'
    ],
    to   : 'admin'
  }, ])        as projection on my.Authors;

  @readonly
  entity Suppliers as projection on my.Suppliers
}
