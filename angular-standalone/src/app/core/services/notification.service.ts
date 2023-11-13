import { Injectable, computed, inject, signal } from '@angular/core'
import addMinutes from 'date-fns/addMinutes'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NGXLogger } from 'ngx-logger'
import {
  Action,
  Notification,
  bulkActionByHeader,
  countNotifications,
  dismiss,
  dismissAll,
  executeAction,
  getBadgeNumber,
  getNotifications,
  getNotificationsByGroup,
  getNotificationsByPriority,
  getNotificationsByType,
  markRead,
  resetBadgeNumber,
} from '../../stores/index'
import { EMPTY, Subject, switchMap, timer } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationService = inject(NzNotificationService)
  private logger = inject(NGXLogger)

  readonly #state = signal<{
    badgeNumber: number
    total: number
    notifications: Notification[]
    groups: { header: Notification; items?: Notification[] | null }[]
    priorities: Notification[]
  }>({
    badgeNumber: 0,
    total: 0,
    notifications: [],
    groups: [],
    priorities: []
  })

  readonly total = computed(() => this.#state().total)
  readonly notifications = computed(() => this.#state().notifications)
  readonly groups = computed(() => this.#state().groups)
  readonly priorities = computed(() => this.#state().priorities)
  readonly badgeNumber = computed(() => this.#state().badgeNumber)
  
  #startRefreshNotification$ = new Subject<boolean>()
  #badgeNumberSub = this.#startRefreshNotification$.pipe(
    switchMap((start) => (start ? timer(0, 60 * 1000) : EMPTY)),
    switchMap(async () => this.refreshBadgeNumber()),
    takeUntilDestroyed()
  ).subscribe()
  
  startRefreshNotification() {
    this.#startRefreshNotification$.next(true)
  }

  async refresh() {
    const [total, notifications] = await Promise.all([countNotifications(), getNotifications()])

    this.#state.update((state) => ({
      ...state,
      total,
      notifications: notifications.map((item) => ({
        ...item,
        CreatedAt: new Date(item.CreatedAt)
      }))
    }))

    this.#state().notifications.forEach((item) => {
      this.logger.debug(
        `Notification date is `,
        item.CreatedAt,
        `current date is `,
        new Date(),
        `add 2 min than current is `,
        addMinutes(item.CreatedAt as Date, 2) > new Date()
      )
      if (item.Priority === 'HIGH' && !item.IsRead && addMinutes(item.CreatedAt as Date, 2) > new Date()) {
        this.notificationService.info(item.Priority, item.Text)
      }
    })
  }

  async refreshByType() {
    const headers = await getNotificationsByType()

    this.#state.update((state) => ({
      ...state,
      groups: headers.map((item) => ({
        header: {
          ...item,
          CreatedAt: new Date(item.CreatedAt)
        }
      }))
    }))
  }

  async refreshGroup(groupId: string) {
    const items = await getNotificationsByGroup(groupId)

    this.#state.update((state) => ({
      ...state,
      groups: state.groups.map((item) => ({
        ...item,
        items:
          item.header.Id === groupId
            ? items.map((item) => ({
                ...item,
                CreatedAt: new Date(item.CreatedAt)
              }))
            : item.items
      }))
    }))
  }

  async refreshByPriority() {
    const notifications = await getNotificationsByPriority()

    this.#state.update((state) => ({
      ...state,
      priorities: notifications.map((item) => ({
        ...item,
        CreatedAt: new Date(item.CreatedAt)
      }))
    }))
  }

  async refreshBadgeNumber() {
    const badgeNumber = await getBadgeNumber()
    this.#state.update((state) => ({
      ...state,
      badgeNumber
    }))

    if (badgeNumber > 0) {
      await this.refresh()
    }
    return badgeNumber
  }

  async refreshAll() {
    await this.refresh()
    await this.refreshByType()
    await this.refreshByPriority()
  }

  async resetBadgeNumber() {
    await resetBadgeNumber()
    this.#state.update((state) => ({
      ...state,
      badgeNumber: 0
    }))
  }

  async dismiss(notificationId: string) {
    await dismiss(notificationId)
    this.deleteNotification(notificationId)
  }

  async dismissAll(parentId: string) {
    await dismissAll(parentId)
    this.deleteGroupNotifications(parentId)
  }

  async markRead(id: string) {
    await markRead(id)
    this.#state.update((state) => ({
      ...state,
      notifications: state.notifications.map((item) =>
        item.Id === id
          ? {
              ...item,
              IsRead: true
            }
          : item
      ),
      priorities: state.priorities.map((item) =>
        item.Id === id
          ? {
              ...item,
              IsRead: true
            }
          : item
      ),
      groups: state.groups.map((group) => ({
        ...group,
        items: group.items?.map((item) =>
          item.Id === id
            ? {
                ...item,
                IsRead: true
              }
            : item
        )
      }))
    }))
  }

  async executeAction(notificationId: string, action: Action) {
    const result = await executeAction(notificationId, action.ActionId)

    if (!result.Success || action.Nature === 'NEGATIVE') {
      this.notificationService.error(action.ActionText, result.MessageText)
    } else {
      this.notificationService.success(action.ActionText, result.MessageText)
    }

    if (result.DeleteOnReturn) {
      this.deleteNotification(notificationId)
    }
  }

  async bulkActionByHeader(header: Notification, action: Action) {
    const result = await bulkActionByHeader(header.Id, action.ActionId)
    this.deleteGroupNotifications(header.Id)
  }

  deleteNotification(notificationId: string) {
    this.#state.update((state) => ({
      ...state,
      notifications: state.notifications.filter((item) => item.Id !== notificationId),
      priorities: state.priorities.filter((item) => item.Id !== notificationId),
      groups: state.groups.map((group) => ({
        ...group,
        items: group.items?.filter((item) => item.Id !== notificationId)
      }))
    }))

    this.refreshAll()
  }

  deleteGroupNotifications(id: string) {
    this.#state.update((state) => {
      const group = state.groups.find(({header}) => header.Id === id)
      return {
        ...state,
        notifications: state.notifications.filter((item) => item.ParentId !== id),
        priorities: state.priorities.filter((item) => item.ParentId !== id),
        groups: state.groups.filter((g) => g.header.Id !== id)
      }
    })

    this.refreshAll()
  }
}
