import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ZngAntdModule } from './core/shared.module';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ZngAntdModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'launchpad';

  #httpClient = inject(HttpClient)

  columns: { name: string; label: string;}[] = []

  books: any[] = []
  constructor() {
    this.#httpClient.get<{value: any[]}>('/browse/Books').subscribe((data) => {
      this.columns = Object.keys(data.value[0]).map((name) => ({
        name,
        label: name,
      }))
      console.log(data.value);
      this.books = data.value;
    });
  }

  submitOrder(book: any, quantity: number) {
    this.#httpClient.post('/browse/submitOrder', {book: book.ID, quantity: quantity ?? 1}).subscribe({
      next: () => {
        const index = this.books.findIndex((b) => b.ID === book.ID);
        this.books[index] = {...this.books[index], quantity};
        this.books = [...this.books];
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        const index = this.books.findIndex((b) => b.ID === book.ID);
        this.books[index] = {...this.books[index], error: err.error.error.message};
        this.books = [...this.books];
      }
    });
  }
}
