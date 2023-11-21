using { zsap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires:'authenticated-user', path:'/admin') { 
  entity Books as projection on my.Books;
  entity Authors@(restrict: [
    { grant: ['READ', 'WRITE'], to: 'admin' },
  ]) as projection on my.Authors;
}