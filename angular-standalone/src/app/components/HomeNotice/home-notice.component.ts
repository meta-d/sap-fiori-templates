import { NotificationListType, NotificationService } from '@/app/core'
import { listAnimation } from '@/app/core/animations'
import { RelativeDatePipe } from '@/app/core/pipes'
import { ZngAntdModule } from '@/app/core/shared.module'
import { Action, Notification } from '@/app/stores'
import { CommonModule } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateModule, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'zng-home-notice',
  templateUrl: './home-notice.component.html',
  styleUrls: ['./home-notice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ZngAntdModule, TranslateModule, RelativeDatePipe],
  animations: [listAnimation]
})
export class HomeNoticeComponent implements AfterViewInit {
  private readonly router = inject(Router)
  private readonly notificationService = inject(NotificationService)
  readonly #translate = inject(TranslateService)

  NotificationListType = NotificationListType

  @Output() closed = new EventEmitter()

  currentLang = this.#translate.currentLang
  readonly byDateNotifications = this.notificationService.byDateNotifications
  readonly byPriorityNotifications = this.notificationService.byPriorityNotifications
  readonly byTypeNotifications = this.notificationService.byTypeNotifications

  readonly hasByType = signal(false)
  readonly hasByPriority = signal(false)

  ngAfterViewInit(): void {
    this.notificationService.refreshBadgeNumber().then(() => this.notificationService.resetBadgeNumber())
  }

  onClickNotification(item: Notification) {
    this.markRead(item)
    if (item.NavigationTargetObject) {
      const queryString = item.NavigationTargetParams.reduce((acc, { Key, Value }) => {
        const paramString = `${Key}=${Value}`
        return acc ? `${acc}&${paramString}` : paramString
      }, '')
      this.router.navigate(['app', item.NavigationIntent], {
        fragment: item.NavigationIntent + (queryString ? '?' + queryString : '')
      })

      this.closed.emit()
    }
  }

  dismiss(item: Notification) {
    this.notificationService.dismiss(item.Id)
  }

  dismissAll(parent: Notification) {
    this.notificationService.dismissAll(parent.Id)
  }

  markRead(item: Notification) {
    this.notificationService.markRead(item.Id)
  }

  executeAction(item: Notification, action: Action) {
    this.notificationService.executeAction(item.Id, action)
  }

  bulkActionByHeader(item: Notification, action: Action) {
    this.notificationService.bulkActionByHeader(item, action)
  }

  onSelectByType() {
    if (!this.hasByType()) {
      this.hasByType.set(true)
      this.notificationService.refreshByType()
    }
  }

  onSelectByPriority() {
    if (!this.hasByPriority()) {
      this.hasByPriority.set(true)
      this.notificationService.refreshByPriority()
    }
  }

  onActiveGroup({header, items}: {header: Notification; items?: Notification[] | null}) {
    if (!items) {
      this.notificationService.refreshGroup(header.Id)
    }
  }

  getPriorityColor(priority: string) {
    switch (priority) {
      case 'HIGH':
        return 'red'
      case 'MEDIUM':
        return 'orange'
      default:
        return 'green'
    }
  }

  getPriorityIcon(priority: string) {
    switch (priority) {
      case 'HIGH':
        return 'close-circle'
      case 'MEDIUM':
        return 'info-circle'
      default:
        return 'check-circle'
    }
  }

  onLoadMore(type: NotificationListType) {
    switch (type) {
      case NotificationListType.ByDate:
        this.notificationService.loadMoreByDate()
        break
      case NotificationListType.ByPriority:
        this.notificationService.loadMoreByPriority()
        break
      case NotificationListType.ByType:
        this.notificationService.loadMoreByType()
        break
    }
  }
}
