using { zsap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires:'authenticated-user', path:'/admin') { 
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
}