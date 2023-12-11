import { ThemeService } from '@/app/core'
import { DOCUMENT } from '@angular/common'
import { computed, DestroyRef, inject, Inject, Injectable } from '@angular/core'
import { driver, DriveStep } from 'driver.js'
/*
 * https://madewith.cn/766
 * 引导页
 * */
@Injectable()
export class DriverService {
  themesService = inject(ThemeService)
  destroyRef = inject(DestroyRef)
  tabId = computed(() => this.themesService.personalization().fixedTab ? '#multi-tab2' : '#multi-tab')

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  load(): void {
    // 是否是固定页签
    const steps: DriveStep[] = [
      {
        element: '#menuNav',
        popover: {
          title: '菜单',
          description: '这里是菜单',
          side: 'right',
          align: 'center'
        }
      },
      {
        element: '#drawer-handle',
        popover: {
          title: '主题设置按钮',
          description: '点击展开设置主题，可以上下拖动',
          side: 'left'
        }
      },
      {
        element: '#tools',
        popover: {
          title: '工具栏',
          description: '锁屏，搜索菜单，全屏，通知消息，退出登录，多语言',
          side: 'bottom'
        }
      },
      {
        element: '#chats',
        popover: {
          title: '联系管理员',
          description: '跟管理员联系联系',
          side: 'top'
        }
      },
      {
        element: '#trigger',
        popover: {
          title: '折叠菜单',
          description: '菜单折叠',
          side: 'bottom'
        }
      },
      {
        element: this.tabId(),
        popover: {
          title: '多标签',
          description: '鼠标右键点击单个标签可以展开多个选项，超出屏幕后，滚动鼠标滚轮可以进行页签滚动',
          side: 'bottom'
        }
      }
    ]

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: '完成',
      nextBtnText: '下一步',
      prevBtnText: '上一步',
      onHighlightStarted: () => {
        this.doc.body.style.cssText = 'overflow:hidden'
      },
      steps
    })

    driverObj.drive()
  }
}
