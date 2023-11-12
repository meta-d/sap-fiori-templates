import { Injectable, computed, inject, signal } from '@angular/core'
import addMinutes from 'date-fns/addMinutes'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import {
  Action,
  Notification,
  countNotifications,
  dismiss,
  executeAction,
  getBadgeNumber,
  getNotifications,
  getNotificationsByGroup,
  getNotificationsByPriority,
  getNotificationsByType,
  markRead,
  resetBadgeNumber,
  useNotificationStore
} from '../../stores/index'


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationService = inject(NzNotificationService)

  readonly state = signal<{
    badgeNumber: number
    total: number
    notifications: Notification[]
    groups: {header: Notification; items?: Notification[] | null}[]
    priorities: Notification[]
  }>({
    badgeNumber: 0,
    total: 0,
    notifications: [],
    groups: [],
    priorities: []
  })

  readonly groups = computed(() => this.state().groups)
  readonly priorities = computed(() => this.state().priorities)

  store = useNotificationStore()

  async refresh() {
    const [total, notifications] = await Promise.all([countNotifications(), getNotifications()])

    this.state.update((state) => ({
      ...state,
      total,
      notifications: notifications.map((item) => ({
        ...item,
        CreatedAt: new Date(item.CreatedAt)
      }))
    }))

    this.state().notifications.forEach((item) => {
      if (item.Priority === 'HIGH' && addMinutes(item.CreatedAt as Date, 1) > new Date()) {
        this.notificationService.info(item.Priority, item.Text)
      }
    })
  }

  async refreshByType() {
    const headers = await getNotificationsByType()

    this.state.update((state) => ({
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

    this.state.update((state) => ({
      ...state,
      groups: state.groups.map((item) => ({
        ...item,
        items: item.header.Id === groupId ? items.map((item) => ({
          ...item,
          CreatedAt: new Date(item.CreatedAt)
        })) : item.items
      }))
    }))
  }

  async refreshByPriority() {
    const notifications = await getNotificationsByPriority()

    this.state.update((state) => ({
      ...state,
      priorities: notifications.map((item) => ({
        ...item,
        CreatedAt: new Date(item.CreatedAt)
      }))
    }))
  }

  async refreshBadgeNumber() {
    const badgeNumber = await getBadgeNumber()
    this.state.update((state) => ({
      ...state,
      badgeNumber
    }))

    if (badgeNumber > 0) {
      this.refresh()
    }
    return badgeNumber
  }

  async resetBadgeNumber() {
    await resetBadgeNumber()
  }

  async dismiss(notificationId: string) {
    await dismiss(notificationId)
    this.deleteNotification(notificationId)
  }

  async markRead(id: string) {
    await markRead(id)
    this.state.update((state) => ({
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

  deleteNotification(notificationId: string) {
    this.state.update((state) => ({
      ...state,
      notifications: state.notifications.filter((item) => item.Id !== notificationId),
      priorities: state.priorities.filter((item) => item.Id !== notificationId),
      groups: state.groups.map((group) => ({
        ...group,
        items: group.items?.filter((item) => item.Id !== notificationId)
      }))
    }))
  }
}
