import { Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { FlightBookingComponent } from './flight-booking/flight-booking.component'
import { ZngOcapSchemaComponent } from './schema/schema.component'

export const routes: Routes = [
  { path: '', redirectTo: 'schema', pathMatch: 'full', data: { hidden: true } },
  {
    path: 'schema',
    title: 'OCAP Schema',
    component: ZngOcapSchemaComponent,
    data: {
      icon: 'console-sql',
      key: 'ocap-schema'
    }
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    data: {
      icon: 'dot-chart',
      key: 'ocap-dashboard'
    }
  },
  {
    path: 'flight-booking',
    title: 'Flight Booking Dashboard',
    component: FlightBookingComponent,
    data: {
      icon: 'schedule',
      key: 'ocap-flight-booking'
    }
  }
]