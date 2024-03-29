import { Filter, FilterOperator, OrderEnum, defineODataStore } from '@metad/cap-odata'

export interface Notification {
  Id: string
  IsRead: boolean
  IsActionable: boolean
  IsGroupHeader: boolean
  Text: string
  Priority: 'HIGH' | string
  SensitiveText: string
  SubTitle: string
  CreatedAt: string | Date
  NavigationTargetObject: string
  NavigationTargetAction: string
  NavigationIntent: string
  NavigationTargetParams: NavigationTargetParam[]
  NotificationTypeKey: string
  NotificationTypeDesc: string
  ParentId: string

  Actions: Action[]
  GroupHeaderText: string
  NotificationCount: number
}

export interface NavigationTargetParam {
  NotificationId: string
  Key: string
  Value: string
}

export interface Action {
  ActionId: string
  ActionText: string
  GroupActionText: string
  Nature: 'POSITIVE' | 'NEGATIVE'
}

export interface ExecuteActionResultType {
  DeleteOnReturn: boolean
  MessageText: string
  Success: boolean
  NotificationId: string
}

const notificationStore = defineODataStore('notification_srv', {
  base: '/sap/opu/odata4/iwngw/notification/default/iwngw',
  version: '0001'
})
export const useNotificationStore = () => {
  const { store, init } = notificationStore

  init()

  return notificationStore
}

export async function getBadgeNumber(): Promise<number> {
  const { functionImport } = notificationStore

  const result = await functionImport<{value: number}>('GetBadgeNumber')

  return result.value
}

export async function resetBadgeNumber() {
  const { actionImport } = notificationStore

  await actionImport('ResetBadgeNumber')
}

export async function dismiss(notificationId: string) {
  const { actionImport } = notificationStore

  await actionImport('Dismiss', {
    NotificationId: notificationId
  })
}

export async function dismissAll(parentId: string) {
  const { actionImport } = notificationStore

  await actionImport('DismissAll', {
    ParentId: parentId
  })
}

export async function markRead(notificationId: string) {
  const { actionImport } = notificationStore

  await actionImport('MarkRead', {
    NotificationId: notificationId
  })
}

export async function executeAction(notificationId: string, actionId: string) {
  const { actionImport } = notificationStore

  return await actionImport<ExecuteActionResultType>('ExecuteAction', {
    NotificationId: notificationId,
    ActionId: actionId
  })
}

export async function bulkActionByHeader(parentId: string, actionId: string) {
  const { actionImport } = notificationStore

  return await actionImport<ExecuteActionResultType[]>('BulkActionByHeader', {
    ParentId: parentId,
    ActionId: actionId
  })
}

export async function countNotifications() {
  const { count } = notificationStore
  return await count('Notifications')
}

export async function getNotifications(filters?: Filter[], skip?: number, top?: number) {
  const { query } = notificationStore
  return await query<Notification>('Notifications', {
    $expand: ['Actions', 'NavigationTargetParams'],
    $orderby: [
      {
        name: 'CreatedAt',
        order: OrderEnum.desc
      }
    ],
    $filter: [
      {
        path: 'IsGroupHeader',
        operator: FilterOperator.eq,
        value: false
      },
      ...(filters ?? [])
    ],
    $skip: skip ?? 0,
    $top: top ?? 5
  })
}

export async function getNotificationsByType(skip?: number, top?: number) {
  const { query } = notificationStore
  return await query<Notification>('Notifications', {
    $expand: ['Actions', 'NavigationTargetParams'],
    $filter: [
      {
        path: 'IsGroupHeader',
        operator: FilterOperator.eq,
        value: true
      }
    ],
    $orderby: [
      {
        name: 'CreatedAt',
        order: OrderEnum.desc
      }
    ],
    $skip: skip ?? 0,
    $top: top ?? 5
  })
}

export async function getNotificationsByPriority(skip?: number, top?: number) {
  const { query } = notificationStore
  return await query<Notification>('Notifications', {
    $expand: ['Actions', 'NavigationTargetParams'],
    $filter: [
      {
        path: 'IsGroupHeader',
        operator: FilterOperator.eq,
        value: false
      }
    ],
    $orderby: [
      {
        name: 'Priority',
        order: OrderEnum.desc
      }
    ],
    $skip: skip ?? 0,
    $top: top ?? 24
  })
}

export async function getNotificationsByGroup(parentId: string, skip?: number, top?: number) {
  return await getNotifications(
    [
      {
        path: 'ParentId',
        operator: FilterOperator.eq,
        value: parentId
      }
    ],
    skip,
    top
  )
}

export async function getSAPWebsocket() {
  const { read } = notificationStore

  return await read<ChannelType>('Channels', 'SAP_WEBSOCKET')
}

export type ChannelType = {
  IsActive: boolean
}