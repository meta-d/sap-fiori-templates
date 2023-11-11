import { FilterOperator, OrderEnum, defineODataStore } from "./odata";

export interface Notification {
    Id: string;
    IsRead: boolean;
    IsActionable: boolean;
    IsGroupHeader: boolean
    Text: string;
    Priority: 'HIGH' | string
    SensitiveText: string
    SubTitle: string
    CreatedAt: string | Date
    NavigationTargetObject: string
    NavigationTargetAction: string
    NavigationIntent: string
    NavigationTargetParams: NavigationTargetParam[]

    Actions: Action[]
    GroupHeaderText: string
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
}


const notificationStore = defineODataStore('notification_srv', {
    base: '/sap/opu/odata4/iwngw/notification/default/iwngw',
    version: '0001'
})
export const useNotificationStore = () => {
    const { store, init } = notificationStore

    return notificationStore
}

export async function getBadgeNumber(): Promise<number> {
    const { functionImport } = notificationStore

    const result = await functionImport('GetBadgeNumber')

    return result.value as number
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

export async function markRead(notificationId: string) {
    const { actionImport } = notificationStore

    await actionImport('MarkRead', {
        NotificationId: notificationId,
    })
}

export async function executeAction(notificationId: string, actionId: string) {
    const { actionImport } = notificationStore

    return await actionImport<ExecuteActionResultType>('ExecuteAction', {
        NotificationId: notificationId,
        ActionId: actionId
    })
}


export async function countNotifications() {
    const { count } = notificationStore
    return await count('Notifications')
}

export async function getNotifications() {
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
            }
        ],
        $skip: 0,
        $top: 10
    })
}

export async function getNotificationGroupHeaders() {
    const { query } = notificationStore
    return await query<Notification>('Notifications', {
        $expand: ['Actions', 'NavigationTargetParams'],
        $filter: [
            {
                path: 'IsGroupHeader',
                operator: FilterOperator.eq,
                value: true
            }
        ]
    })
}