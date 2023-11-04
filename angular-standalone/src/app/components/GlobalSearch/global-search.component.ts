import { SearchService, ThemeService } from '@/app/core/services'
import { ZngAntdModule } from '@/app/core/shared.module'
import { MenuMode, ThemeType } from '@/app/core/types'
import { CommonModule } from '@angular/common'
import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { NzConfigService } from 'ng-zorro-antd/core/config'
import { NzMenuThemeType } from 'ng-zorro-antd/menu'
import { NzModalRef } from 'ng-zorro-antd/modal'
import { debounceTime, map, startWith } from 'rxjs/operators'

interface ResultItem {
  selItem: boolean;
  isAliIcon: boolean;
  title: string;
  routePath: string;
  icon: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, ZngAntdModule],
  selector: 'zng-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent {
  private searchService = inject(SearchService)
  private nzConfigService = inject(NzConfigService)
  private translateService = inject(TranslateService)
  private modalRef = inject(NzModalRef)
  private cdr = inject(ChangeDetectorRef)

  searchControl = new FormControl()
  inputValue: string | null = null;
  resultListShow: ResultItem[] = [];
  resultList: ResultItem[] = [];

  private searchSub = this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), takeUntilDestroyed()).subscribe((value) => {
    this.resultListShow = value ? this.searchService.search(value) as any[] : []
    console.log(this.resultListShow)
  })

  clearInput(): void {
    this.inputValue = '';
    this.resultListShow = [];
    this.cdr.markForCheck();
  }

  resultClick(resultItem: ResultItem): void {
    this.destroyModal();
  }

  mouseOverItem(item: ResultItem): void {
    this.resultListShow.forEach(resultItem => {
      resultItem.selItem = false;
    });
    item.selItem = true;
  }

  destroyModal(): void {
    this.modalRef.destroy();
  }
}
