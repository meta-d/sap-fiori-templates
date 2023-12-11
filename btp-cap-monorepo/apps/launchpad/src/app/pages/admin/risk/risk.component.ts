import { CommonModule } from '@angular/common'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Component, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import { from, map, tap } from 'rxjs'
import { ZngAntdModule } from '../../../core/shared.module'
import { queryRisks } from '../../../stores'

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
  risks = toSignal<any[], any[]>(
    from(queryRisks()).pipe(
      map((risks) => risks.map((item) => ({...item, expand: false}))),
      tap((items) => {
        this.loading.set(false)
        this.columns = Object.keys(items[0]).filter((name) => name !== 'supplier').map((name) => ({
          name,
          label: name
        }))
      })
    ),
    { initialValue: [] }
  )
  loading = signal(true)

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
