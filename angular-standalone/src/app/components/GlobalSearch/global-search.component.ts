import { AppMenu, SearchService } from '@/app/core/services'
import { ZngAntdModule } from '@/app/core/shared.module'
import { CommonModule } from '@angular/common'
import { Component, ElementRef, ViewChild, inject } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { DynamicViewModule } from '@ngneat/overview';
import {
  CommandComponent,
  EmptyDirective,
  GroupComponent,
  InputDirective,
  ItemDirective,
  ListComponent,
  SeparatorComponent
} from '@ngneat/cmdk'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { NzModalRef } from 'ng-zorro-antd/modal'

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ZngAntdModule,
    CommandComponent,
    GroupComponent,
    InputDirective,
    ItemDirective,
    ListComponent,
    EmptyDirective,
    SeparatorComponent,
    DynamicViewModule
  ],
  selector: 'zng-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent {
  private searchService = inject(SearchService)
  private translateService = inject(TranslateService)
  private modalRef = inject(NzModalRef)
  private router = inject(Router)

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>

  // inputValue = ''
  readonly groups = this.searchService.menuGroups
  readonly projectItems = new Array(6)
  styleTransform = ''

  destroyModal(): void {
    this.modalRef.destroy()
  }

  // cmdk
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Enter') {
      this.bounce()
    }

    if (this.searchInput.nativeElement.value?.length) {
      return
    }

    if (ev.key === 'Backspace') {
      ev.preventDefault()
      this.bounce()
    }
  }

  openApp(menu: AppMenu) {
    this.router.navigate([menu.path])
    this.destroyModal()
  }

  bounce() {
    this.styleTransform = 'scale(0.96)'
    setTimeout(() => {
      this.styleTransform = ''
    }, 100)
  }
}
