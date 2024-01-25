import { StoreStatus, defineODataStore } from '@metad/cap-odata'

const riskStore = defineODataStore('risk', {
  base: '/api/odata/v4/'
})
export const useRiskStore = () => {
  const { store, init } = riskStore
  if (store.value.status === StoreStatus.init || store.value.status === StoreStatus.error) {
    init()
  }

  return riskStore
}

export async function querySuppliers(): Promise<Supplier[]> {
  const { query } = riskStore
  return await query('Suppliers', {
    $top: 11
  })
}

export async function queryRisks(): Promise<Risk[]> {
  const { query } = riskStore
  return await query('Risks', {
    $top: 11,
    $expand: ['supplier']
  })
}

export interface Supplier {
  BusinessPartner?: string
  Customer?: string
  Supplier?: string
  AcademicTitle?: string
  AuthorizationGroup?: string
  BusinessPartnerCategory?: string
  BusinessPartnerFullName?: string
  BusinessPartnerGrouping?: string
  BusinessPartnerName?: string
  BusinessPartnerUUID?: string
  CorrespondenceLanguage?: string
  CreatedByUser?: string
  CreationDate?: string
  CreationTime?: string
  FirstName?: string
  FormOfAddress?: string
  Industry?: string
  InternationalLocationNumber1?: string
  InternationalLocationNumber2?: string
  IsFemale?: boolean
  IsMale?: boolean
  IsNaturalPerson?: string
  IsSexUnknown?: boolean
  GenderCodeName?: string
  Language?: string
  LastChangeDate?: string
  LastChangeTime?: string
  LastChangedByUser?: string
  LastName?: string
  LegalForm?: string
  OrganizationBPName1?: string
  OrganizationBPName2?: string
  OrganizationBPName3?: string
  OrganizationBPName4?: string
  OrganizationFoundationDate?: string
  OrganizationLiquidationDate?: string
  SearchTerm1?: string
  SearchTerm2?: string
  AdditionalLastName?: string
  BirthDate?: string
  BusinessPartnerBirthDateStatus?: string
  BusinessPartnerBirthplaceName?: string
  BusinessPartnerDeathDate?: string
  BusinessPartnerIsBlocked?: boolean
  BusinessPartnerType?: string
  ETag?: string
  GroupBusinessPartnerName1?: string
  GroupBusinessPartnerName2?: string
  IndependentAddressID?: string
  InternationalLocationNumber3?: string
  MiddleName?: string
  NameCountry?: string
  NameFormat?: string
  PersonFullName?: string
  PersonNumber?: string
  IsMarkedForArchiving?: boolean
  BusinessPartnerIDByExtSystem?: string
  BusinessPartnerPrintFormat?: string
  BusinessPartnerOccupation?: string
  BusPartMaritalStatus?: string
  BusPartNationality?: string
  BusinessPartnerBirthName?: string
  BusinessPartnerSupplementName?: string
  NaturalPersonEmployerName?: string
  LastNamePrefix?: string
  LastNameSecondPrefix?: string
  Initials?: string
  BPDataControllerIsNotRequired?: boolean
  TradingPartner?: string
}

export interface Risk {
  ID?: string
  title?: string
  prio?: string
  descr?: string
  miti_ID?: string
  impact?: number
  criticality?: number
  supplier_BusinessPartner?: string
}
