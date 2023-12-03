import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AnalyticalCardModule } from '@metad/ocap-angular/analytical-card'
import { ControlsModule } from '@metad/ocap-angular/controls'
import { DensityDirective, NgmDSCoreService } from '@metad/ocap-angular/core'
import { AgentType, OrderDirection, Syntax } from '@metad/ocap-core'

@Component({
  standalone: true,
  selector: 'zng-flight-booking',
  templateUrl: 'flight-booking.component.html',
  styles: [
    `
      :host {
        height: 100vh;
      }
    `
  ],
  imports: [CommonModule, FormsModule, AnalyticalCardModule, ControlsModule, DensityDirective]
})
export class FlightBookingComponent {
  #dsCoreService = inject(NgmDSCoreService)
  OrderDirection = OrderDirection
  cube = '$2CZYCUBEFLIGHTBOOK'

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
