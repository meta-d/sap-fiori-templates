import { NotificationService, mapDateLocale } from '@/app/core'
import { listAnimation } from '@/app/core/animations'
import { ZngAntdModule } from '@/app/core/shared.module'
import { Action, Notification } from '@/app/stores'
import { CommonModule } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import formatRelative from 'date-fns/formatRelative'

@Component({
  selector: 'zng-home-notice',
  templateUrl: './home-notice.component.html',
  styleUrls: ['./home-notice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ZngAntdModule, TranslateModule],
  animations: [listAnimation]
})
export class HomeNoticeComponent implements AfterViewInit {
  private readonly translate = inject(TranslateService)
  private readonly router = inject(Router)
  private readonly notificationService = inject(NotificationService)

  @Output() closed = new EventEmitter()

  readonly notification = computed(() => {
    const total = this.notificationService.total()
    const notifications = this.notificationService.notifications()
    return {
      total,
      notifications: notifications?.map((item) => ({
        ...item,
        CreatedAt: formatRelative(item.CreatedAt as Date, new Date(), {
          locale: mapDateLocale(this.translate.currentLang)
        })
      }))
    }
  })

  readonly groups = this.notificationService.groups
  readonly priorities = this.notificationService.priorities

  readonly hasByType = signal(false)
  readonly hasByPriority = signal(false)


  ngAfterViewInit(): void {
    this.notificationService.refresh().then(() => this.notificationService.resetBadgeNumber())
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
}
