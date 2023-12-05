import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DensityDirective, DisplayDensity, NgmDSCoreService } from '@metad/ocap-angular/core'
import { EntityCapacity, NgmEntitySchemaComponent } from '@metad/ocap-angular/entity'
import { AgentType, ISlicer, OrderDirection, Syntax } from '@metad/ocap-core'

@Component({
  standalone: true,
  selector: 'zng-ocap-schema',
  templateUrl: 'schema.component.html',
  styleUrl: 'schema.component.scss',
  imports: [CommonModule, FormsModule, NgmEntitySchemaComponent, DensityDirective]
})
export class ZngOcapSchemaComponent {
  #dsCoreService = inject(NgmDSCoreService)
  DisplayDensity = DisplayDensity
  OrderDirection = OrderDirection
  EntityCapacity = EntityCapacity

  country = '[2CIFICOUNTRY]'
  cube = '$2CZYCUBEFLIGHTBOOK'

  calFilter: ISlicer | null = null

  slicers = signal<ISlicer[]>([])

  constructor() {
    this.#dsCoreService.registerModel({
      id: '##########',
      key: '##########',
      name: 'S4CDS',
      type: 'XMLA',
      agentType: AgentType.Server,
      syntax: Syntax.MDX,
      dialect: 'SAP',
      catalog: '$INFOCUBE'
    })
  }

}
