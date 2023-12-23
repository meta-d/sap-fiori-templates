import { inject } from '@angular/core'
import { CanDeactivateFn } from '@angular/router'
import { NzModalService } from 'ng-zorro-antd/modal'

/**
 * Check component is dirty then open confirm dialog to save the data changes.
 */
export interface DirtyCheck {
  /**
   * Is dirty
   */
  isDirty(): boolean

  /**
   * Confirm to save
   * 
   * @returns 
   */
  confirm?: () => Promise<boolean>
}

/**
 * Has unsaved changes guard, confirm to save the data
 * 
 * @param component 
 * @returns 
 */
export const hasUnsavedChangesGuard: CanDeactivateFn<DirtyCheck> = (component: DirtyCheck) => {
  const modalService = inject(NzModalService)

  if (component.isDirty && !component.isDirty()) {
    return true
  }

  if (component.confirm) {
    return component.confirm()
  }

  return new Promise((resolve, reject) => {
    modalService.confirm({
      nzTitle: '有未保存数据',
      nzContent: '确认是否退出当前页面',
      nzOnOk: () => {
        resolve(true)
      },
      nzOnCancel: () => {
        resolve(false)
      }
    })
  })
}
