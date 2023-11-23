import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ZngAntdModule],
  selector: 'zng-admin-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.scss']
})
export class AdminRiskComponent {
  #httpClient = inject(HttpClient)

  columns: { name: string; label: string }[] = []

  books: any[] = []

  constructor() {
    this.#httpClient.get<{ value: any[] }>('/api/browse/Books').subscribe((data) => {
      this.columns = Object.keys(data.value[0]).map((name) => ({
        name,
        label: name
      }))
      console.log(data.value)
      this.books = data.value
    })
  }

  submitOrder(book: any, quantity: number) {
    this.#httpClient.post('/api/browse/submitOrder', { book: book.ID, quantity: quantity ?? 1 }).subscribe({
      next: () => {
        const index = this.books.findIndex((b) => b.ID === book.ID)
        this.books[index] = { ...this.books[index], quantity }
        this.books = [...this.books]
      },
      error: (err: HttpErrorResponse) => {
        console.error(err)
        const index = this.books.findIndex((b) => b.ID === book.ID)
        this.books[index] = {
          ...this.books[index],
          error: err.error.error.message
        }
        this.books = [...this.books]
      }
    })
  }
}
