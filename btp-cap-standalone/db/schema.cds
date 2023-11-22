using {
  Currency,
  managed,
  sap
} from '@sap/cds/common';
// using { EPM_REF_APPS_PROD_MAN as epm } from '../srv/external/EPM_REF_APPS_PROD_MAN';
using { API_BUSINESS_PARTNER as bupa } from '../srv/external/API_BUSINESS_PARTNER';

namespace zsap.capire;

entity Books : managed {
  key ID       : Integer;
      title    : localized String(111);
      descr    : localized String(1111);
      author   : Association to Authors;
      genre    : Association to Genres;
      stock    : Integer;
      price    : Decimal(9, 2);
      currency : Currency;
}

entity Authors : managed {
  key ID    : Integer;
      name  : String(111);
      books : Association to many Books
                on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID       : Integer;
      parent   : Association to Genres;
      children : Composition of many Genres
                   on children.parent = $self;
}

entity CapBusinessPartner {
  key ID                      : String;
      firstName               : String;
      lastName                : String;
      businessPartnerName     : String;
      businessPartnerFullName : String;
      businessPartnerUuid     : String;
}

entity Suppliers as projection on bupa.A_BusinessPartner {
  key BusinessPartner as ID,
  BusinessPartnerFullName as fullName,
  BusinessPartnerIsBlocked as isBlocked,
}

entity Risks : managed {
  key ID      : UUID  @(Core.Computed : true);
  title       : String(100);
  prio        : String(5);
  descr       : String;
  miti        : Association to Mitigations;
  impact      : Integer;
  criticality : Integer;
  supplier    : Association to Suppliers;
}

entity Mitigations : managed {
  key ID       : UUID  @(Core.Computed : true);
  description  : String;
  owner        : String;
  timeline     : String;
  risks        : Association to many Risks on risks.miti = $self;
}
