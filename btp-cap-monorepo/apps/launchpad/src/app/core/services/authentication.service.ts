import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private httpClient = inject(HttpClient)

  logout() {
    return this.httpClient.get('/sap/public/bc/icf/logoff', {responseType: 'text'})
  }

  currentUser() {
    return this.httpClient.get('/api/admin/current()')
  }
}
