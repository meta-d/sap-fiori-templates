using {zcap.riskmanagement as my} from '../db/risk-management';

@impl: 'srv/impl/risk-service-handler.js'
service RiskService {
    entity Risks       as projection on my.Risks;
    annotate Risks with @odata.draft.enabled;
    entity Mitigations as projection on my.Mitigations;
    annotate Mitigations with @odata.draft.enabled;

    @readonly
    entity Suppliers @(restrict: [{
        grant: ['READ'],
        to   : [
            'RiskViewer',
            'RiskManager'
        ]
    }])                as projection on my.Suppliers;
}
