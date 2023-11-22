import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [JsonPipe, RouterModule],
  selector: 'btp-cap-monorepo-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'launchpad';

  #httpClient = inject(HttpClient)
  
  user = toSignal(this.#httpClient.get('/api/auth/current()'))
}
