import { Inject, Injectable, Optional } from '@angular/core'
import { NgmDSCacheService, NgmDSCoreService, OCAP_AGENT_TOKEN, OCAP_DATASOURCE_TOKEN } from '@metad/ocap-angular/core'
import { Agent, AgentType, DataSourceFactory, DataSourceOptions, Syntax } from '@metad/ocap-core'

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
    catalog: ZngS4DSCoreService.S4InfoCube
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
}
