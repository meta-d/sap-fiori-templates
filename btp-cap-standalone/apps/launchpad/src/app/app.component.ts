import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'launchpad';

  #httpClient = inject(HttpClient)

  books: any[] = []
  constructor() {
    this.#httpClient.get<{value: any[]}>('/browse/Books').subscribe((data) => {
      console.log(data.value);
      this.books = data.value;
    });
  }
}
