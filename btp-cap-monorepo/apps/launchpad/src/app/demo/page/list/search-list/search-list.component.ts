import { fadeRouteAnimation } from '@/app/core/animations'
import { NgFor } from '@angular/common'
import { ChangeDetectionStrategy, Component, DestroyRef, TemplateRef, ViewChild, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterEvent, RouterOutlet } from '@angular/router'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSafeAny } from 'ng-zorro-antd/core/types'
import { NzWaveModule } from 'ng-zorro-antd/core/wave'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header'
import { NzSpaceModule } from 'ng-zorro-antd/space'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { filter } from 'rxjs/operators'

interface TabInterface {
  label: string
  url: string
}

@Component({
  selector: 'zng-search-list',
  templateUrl: './search-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzSpaceModule,
    NzButtonModule,
    NzInputModule,
    NzWaveModule,
    NzTabsModule,
    NgFor,
    RouterOutlet
  ]
})
export class SearchListComponent {
  @ViewChild('headerContent', { static: true }) headerContent!: TemplateRef<NzSafeAny>
  @ViewChild('headerFooter', { static: true }) headerFooter!: TemplateRef<NzSafeAny>

  currentSelTab: number = 0
  destroyRef = inject(DestroyRef)
  tabData: TabInterface[] = [
    { label: '文章', url: 'page/list/search-list/article' },
    { label: '项目', url: 'page/list/search-list/project' },
    { label: '应用', url: 'page/list/search-list/application' }
  ]

  currentSearchList: string = 'article'

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        if (event instanceof RouterEvent) {
          this.currentSelTab = this.tabData.findIndex((item) => {
            return item.url === event.url
          })
        }
      })
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key']
  }

  to(item: TabInterface): void {
    this.router.navigateByUrl(item.url)
  }

  setCurrentSearchList(name: string) {
    this.currentSearchList = name
  }
}
