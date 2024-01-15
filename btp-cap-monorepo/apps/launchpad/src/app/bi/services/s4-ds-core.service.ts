import { Inject, Injectable, Optional } from '@angular/core'
import { NgmDSCacheService, NgmDSCoreService, OCAP_AGENT_TOKEN, OCAP_DATASOURCE_TOKEN } from '@metad/ocap-angular/core'
import {
  Agent,
  AgentType,
  AggregationRole,
  C_MEASURES,
  CalculatedProperty,
  CalculationType,
  DataSourceFactory,
  DataSourceOptions,
  Syntax
} from '@metad/ocap-core'
import { nanoid } from 'nanoid'

@Injectable()
export class ZngS4DSCoreService extends NgmDSCoreService {
  static readonly S4ModelKey = '##########'
  static readonly S4ModelName = 'S4CDS'
  static readonly S4InfoCube = '$INFOCUBE'

  static readonly S4Model: DataSourceOptions = {
    key: ZngS4DSCoreService.S4ModelKey,
    name: ZngS4DSCoreService.S4ModelName,
    type: 'XMLA',
    agentType: AgentType.Server,
    syntax: Syntax.MDX,
    dialect: 'sapbw',
    catalog: ZngS4DSCoreService.S4InfoCube,

    schema: {
      name: 'FLIGHTBOOK',
      cubes: [],
      entitySets: {
        $2CZCUBEFLIGHTBOOK: {
          name: '$2CZCUBEFLIGHTBOOK',
          entityType: {
            name: '$2CZCUBEFLIGHTBOOK',
            properties: {
              URBookings: {
                __id__: nanoid(),
                name: 'URBookings',
                role: AggregationRole.measure,
                calculationType: CalculationType.Calculated,
                formula: `Sum([2CZCUBEFLIGHTBOOK-CURRENCY].[XEU], [Measures].[2CKY735WUO8SZXL3JSSP9T0DC4W])`,
                dimension: C_MEASURES,
                caption: '欧元区预定量'
              } as CalculatedProperty
            }
          }
        }
      }
    }
  }

  constructor(
    @Inject(OCAP_AGENT_TOKEN)
    public override agents: Array<Agent>,
    @Inject(OCAP_DATASOURCE_TOKEN)
    public override dataSourceFactory?: Array<{ type: string; factory: DataSourceFactory }>,
    @Optional()
    override cacheService?: NgmDSCacheService
  ) {
    super(agents, [ZngS4DSCoreService.S4Model], dataSourceFactory, cacheService)
  }

  updateCatalog(catalog: string) {
    this.registerModel({
      ...ZngS4DSCoreService.S4Model,
      catalog
    })
  }
}
