import { Injectable, computed, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import addMinutes from 'date-fns/addMinutes'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { NGXLogger } from 'ngx-logger'
import { EMPTY, Subject, switchMap, timer } from 'rxjs'
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
  resetBadgeNumber
} from '../../stores/index'

export enum NotificationListType {
  ByDate = 'ByDate',
  ByType = 'ByType',
  ByPriority = 'ByPriority'
}

export interface NotificationList {
  type: NotificationListType
  // for notifications by date / by priority
  items?: Notification[] | null
  // for notifications by type
  groups?: { header: Notification; items?: Notification[] | null }[]
  loadingMore?: boolean
  hasMore?: boolean
  page: number
  total: number | null
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationService = inject(NzNotificationService)
  private logger = inject(NGXLogger)

  #pageSize = 5

  readonly #state = signal<{
    badgeNumber: number
    total: number
    initialized?: boolean
  }>({
    badgeNumber: 0,
    total: 0,
    initialized: false
  })

  readonly byDateNotifications = signal<NotificationList>({
    type: NotificationListType.ByDate,
    total: 0,
    page: 0,
    loadingMore: false,
    hasMore: true
  })
  readonly byPriorityNotifications = signal<NotificationList>({
    type: NotificationListType.ByPriority,
    total: 0,
    page: 0,
    loadingMore: false,
    hasMore: true
  })
  readonly byTypeNotifications = signal<NotificationList>({
    type: NotificationListType.ByType,
    total: null,
    page: 0,
    loadingMore: false,
    hasMore: true
  })

  readonly total = computed(() => this.#state().total)
  readonly badgeNumber = computed(() => this.#state().badgeNumber)

  #startRefreshNotification$ = new Subject<boolean>()
  #badgeNumberSub = this.#startRefreshNotification$
    .pipe(
      switchMap((start) => (start ? timer(0, 60 * 1000) : EMPTY)),
      switchMap(async () => this.refreshBadgeNumber()),
      takeUntilDestroyed()
    )
    .subscribe()

  startRefreshNotification() {
    this.#startRefreshNotification$.next(true)
  }

  async refresh() {
    const total = await countNotifications()
    this.byDateNotifications.update((state) => ({ ...state, total, page: 0, items: [] }))
    this.#state.update((state) => ({...state, initialized: true}))

    await this.loadMoreByDate()

    this.byDateNotifications().items?.forEach((item) => {
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
    this.byTypeNotifications.update((state) => ({
      ...state,
      page: 0,
      groups: []
    }))

    await this.loadMoreByType()
  }

  async loadMoreByDate() {
    this.byDateNotifications.update((state) => ({
      ...state,
      loadingMore: true
    }))

    const notifications = await getNotifications([], this.byDateNotifications().page * this.#pageSize, this.#pageSize)
    this.byDateNotifications.update((state) => ({
      ...state,
      items: [
        ...(state.items ?? []),
        ...notifications.map((item) => ({
          ...item,
          CreatedAt: new Date(item.CreatedAt)
        }))
      ],
      loadingMore: false,
      hasMore: notifications.length === this.#pageSize,
      page: state.page + 1
    }))
  }

  async loadMoreByPriority() {
    this.byPriorityNotifications.update((state) => ({
      ...state,
      loadingMore: true
    }))
    const notifications = await getNotificationsByPriority(
      this.byPriorityNotifications().page * this.#pageSize,
      this.#pageSize
    )
    this.byPriorityNotifications.update((state) => ({
      ...state,
      items: [
        ...(state.items ?? []),
        ...notifications.map((item) => ({
          ...item,
          CreatedAt: new Date(item.CreatedAt)
        }))
      ],
      loadingMore: false,
      hasMore: notifications.length === this.#pageSize,
      page: state.page + 1
    }))
  }

  async loadMoreByType() {
    this.byTypeNotifications.update((state) => ({
      ...state,
      loadingMore: true
    }))

    const notifications = await getNotificationsByType(this.byTypeNotifications().page * this.#pageSize, this.#pageSize)
    this.byTypeNotifications.update((state) => ({
      ...state,
      groups: [
        ...(state.groups ?? []),
        ...notifications.map((item) => ({
          header: {
            ...item,
            CreatedAt: new Date(item.CreatedAt)
          }
        }))
      ],
      loadingMore: false,
      hasMore: notifications.length === this.#pageSize,
      page: state.page + 1
    }))
  }

  async refreshGroup(groupId: string) {
    const items = await getNotificationsByGroup(groupId)
    this.byTypeNotifications.update((state) => ({
      ...state,
      groups: state.groups?.map((g) => ({
        ...g,
        items:
          g.header.Id === groupId
            ? items.map((item) => ({
                ...item,
                CreatedAt: new Date(item.CreatedAt)
              }))
            : g.items
      }))
    }))
  }

  async refreshByPriority() {
    this.byPriorityNotifications.update((state) => ({
      ...state,
      items: [],
      page: 0,
      hasMore: true,
      loadingMore: false
    }))

    await this.loadMoreByPriority()
  }

  async refreshBadgeNumber() {
    const badgeNumber = await getBadgeNumber()
    this.#state.update((state) => ({
      ...state,
      badgeNumber
    }))

    if (badgeNumber > 0 || !this.#state().initialized) {
      await this.refresh()
    }
    
    return badgeNumber
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

    this.byDateNotifications.update((state) => ({
      ...state,
      items: state.items?.map((item) =>
        item.Id === id
          ? {
              ...item,
              IsRead: true
            }
          : item
      )
    }))
    this.byPriorityNotifications.update((state) => ({
      ...state,
      items: state.items?.map((item) =>
        item.Id === id
          ? {
              ...item,
              IsRead: true
            }
          : item
      )
    }))
    this.byTypeNotifications.update((state) => ({
      ...state,
      groups: state.groups?.map((group) => ({
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
    this.byDateNotifications.update((state) => ({
      ...state,
      items: state.items?.filter((item) => item.Id !== notificationId)
    }))
    this.byPriorityNotifications.update((state) => ({
      ...state,
      items: state.items?.filter((item) => item.Id !== notificationId)
    }))
    this.byTypeNotifications.update((state) => ({
      ...state,
      groups: state.groups?.map((group) => ({
        ...group,
        items: group.items?.filter((item) => item.Id !== notificationId)
      }))
    }))
  }

  deleteGroupNotifications(id: string) {
    this.byDateNotifications.update((state) => ({
      ...state,
      items: state.items?.filter((item) => item.ParentId !== id)
    }))
    this.byPriorityNotifications.update((state) => ({
      ...state,
      items: state.items?.filter((item) => item.ParentId !== id)
    }))
    this.byTypeNotifications.update((state) => ({
      ...state,
      groups: state.groups?.filter((g) => g.header.Id !== id)
    }))
  }
}
