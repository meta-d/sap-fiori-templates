import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { FlightBookingComponent } from './flight-booking/flight-booking.component'

const routes: Routes = [
  {
    path: 'dashboard',
    title: 'Admin Dashboard',
    component: DashboardComponent,
    data: {
      icon: 'user',
      key: 'admin-dashboard'
    }
  },
  {
    path: 'flight-booking',
    title: 'Admin Dashboard',
    component: FlightBookingComponent,
    data: {
      icon: 'user',
      key: 'admin-flight-booking'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BIRoutingModule {}
