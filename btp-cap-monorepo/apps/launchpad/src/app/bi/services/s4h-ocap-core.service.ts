import { Inject, Injectable, Optional } from '@angular/core'
import { NgmDSCacheService, NgmDSCoreService, OCAP_AGENT_TOKEN, OCAP_DATASOURCE_TOKEN } from '@metad/ocap-angular/core'
import { Agent, AgentType, DataSourceFactory, DataSourceOptions, Property, Syntax } from '@metad/ocap-core'
import { cloneDeep } from 'lodash-es'
import { FlightBookEntityType } from './flightbook'

@Injectable()
export class ZngS4DSCoreService extends NgmDSCoreService {
  static readonly S4ModelKey = '##########'
  static readonly S4ModelName = 'S4CDS'
  static readonly S4InfoCube = '$INFOCUBE'
  static readonly S4FlightBookCdsSqlViewName = 'ZCUBEFLIGHTBOOK'
  static readonly S4FlightBookCube = `$2C${ZngS4DSCoreService.S4FlightBookCdsSqlViewName}`

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
        [ZngS4DSCoreService.S4FlightBookCube]: {
          name: ZngS4DSCoreService.S4FlightBookCube,
          entityType: FlightBookEntityType
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

  updateProperty(entity: string, property: Property) {
    const schema = cloneDeep(ZngS4DSCoreService.S4Model.schema)
    schema!.entitySets![entity]!.entityType.properties[property.name] = property

    this.registerModel({
      ...ZngS4DSCoreService.S4Model,
      schema
    })
  }
}
