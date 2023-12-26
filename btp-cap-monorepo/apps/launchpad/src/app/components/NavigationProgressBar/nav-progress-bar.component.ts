import { NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from '@angular/router'

@Component({
  selector: 'zng-navigation-progress-bar',
  templateUrl: './nav-progress-bar.component.html',
  styleUrls: ['./nav-progress-bar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf]
})
export class NavigationProgressBarComponent {
  private router = inject(Router)
  readonly isFetching = signal(false)

  #routerSub = this.router.events.pipe(takeUntilDestroyed()).subscribe((evt) => {
    // 表示在惰性加载某个路由配置前触发的事件。
    if (!this.isFetching() && evt instanceof RouteConfigLoadStart) {
      this.isFetching.set(true)
    }
    if (!this.isFetching() && evt instanceof NavigationStart) {
      this.isFetching.set(true)
    }
    if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
      this.isFetching.set(false)
      // if (evt instanceof NavigationError) {
      // }
      return
    }
    if (!(evt instanceof NavigationEnd || evt instanceof RouteConfigLoadEnd)) {
      return
    }
    if (this.isFetching()) {
      setTimeout(() => {
        this.isFetching.set(false)
      }, 600)
    }
  })
}
