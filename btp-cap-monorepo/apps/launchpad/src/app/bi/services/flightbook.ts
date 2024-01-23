import { AggregationRole, C_MEASURES, CalculatedProperty, CalculationType } from '@metad/ocap-core'
import { nanoid } from 'nanoid'

export const FlightBookEntityType = {
  name: '$2CZCUBEFLIGHTBOOK',
  properties: {
    EURBookings: {
      __id__: nanoid(),
      name: 'EURBookings',
      role: AggregationRole.measure,
      calculationType: CalculationType.Calculated,
      formula: `Sum([2CZCUBEFLIGHTBOOK-CURRENCY].[EUR], [Measures].[2CKY735WUO8SZXL3JSSP9T0DC4W])`,
      dimension: C_MEASURES,
      caption: '欧元区预定量'
    } as CalculatedProperty
  }
}
