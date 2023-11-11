import { Injectable, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Action, Notification, countNotifications, dismiss, executeAction, getBadgeNumber, getNotificationGroupHeaders, getNotifications, markRead, resetBadgeNumber } from '../../stores/index'
import { FioriLaunchpadService } from './flp.service'
import { NzNotificationService } from 'ng-zorro-antd/notification'
import subMinutes from 'date-fns/subMinutes'
import addMinutes from 'date-fns/addMinutes'


@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private flpService = inject(FioriLaunchpadService)
    private notificationService = inject(NzNotificationService)
    private route = inject(ActivatedRoute)
    private router = inject(Router)

    readonly state = signal<{
        badgeNumber: number;
        total: number;
        notifications: Notification[];
        groupHeaders: Notification[];
    }>({
        badgeNumber: 0,
        total: 0,
        notifications: [],
        groupHeaders: []
    })

    async refresh() {
        const [total, notifications] = await Promise.all([
            countNotifications(),
            getNotifications()
        ])

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

    async refreshGroupHeader() {
        const headers = await getNotificationGroupHeaders()

        this.state.update((state) => ({
            ...state,
            groupHeaders: headers.map((item) => ({
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

    async dismiss(id: string) {
        await dismiss(id)
        this.state.update((state) => ({
            ...state,
            notifications: state.notifications.filter((item) => item.Id !== id)
        }))
    }

    async markRead(id: string) {
        await markRead(id)
        this.state.update((state) => ({
            ...state,
            notifications: state.notifications.map((item) => item.Id === id ? {
                ...item,
                IsRead: true
            } : item)
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
            this.state.update((state) => ({
                ...state,
                notifications: state.notifications.filter((item) => item.Id !== notificationId)
            }))
        }
    }
}
