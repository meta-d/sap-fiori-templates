namespace zcap.riskmanagement;

using {managed} from '@sap/cds/common';
using {API_BUSINESS_PARTNER as bupa} from '../srv/external/API_BUSINESS_PARTNER';

entity Risks : managed {
    key ID          : UUID @(Core.Computed: true);
        title       : String(100);
        prio        : String(5);
        descr       : String;
        miti        : Association to Mitigations;
        impact      : Integer;
        criticality : Integer;
        supplier    : Association to Suppliers;
}

entity Mitigations : managed {
    key ID          : UUID @(Core.Computed: true);
        description : String;
        owner       : String;
        timeline    : String;
        risks       : Association to many Risks
                          on risks.miti = $self;
}

// External service definition
entity Suppliers as
    projection on bupa.A_BusinessPartner {
        key BusinessPartner          as ID,
            BusinessPartnerFullName  as fullName,
            BusinessPartnerIsBlocked as isBlocked,
    }
