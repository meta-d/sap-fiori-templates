import { Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { FlightBookingComponent } from './flight-booking/flight-booking.component'
import { ZngOcapSchemaComponent } from './schema/schema.component'

export const routes: Routes = [
  {
    path: 'schema',
    title: 'OCAP Schema',
    component: ZngOcapSchemaComponent,
    data: {
      icon: 'user',
      key: 'ocap-schema'
    }
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
    data: {
      icon: 'user',
      key: 'ocap-dashboard'
    }
  },
  {
    path: 'flight-booking',
    title: 'Flight Booking Dashboard',
    component: FlightBookingComponent,
    data: {
      icon: 'user',
      key: 'ocap-flight-booking'
    }
  }
]
