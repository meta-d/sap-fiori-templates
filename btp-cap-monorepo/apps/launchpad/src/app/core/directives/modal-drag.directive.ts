import { Directive, Host, inject } from '@angular/core';

import { NzModalComponent } from 'ng-zorro-antd/modal';

import { ModalDragService } from '../services/modal-drag.service';

/**
 * 可拖动的对话框
 *
 * @example
 * ``` html
 * <nz-modal zngModalDrag ></nz-modal>
 ```
 */
@Directive({
    selector: 'nz-modal[zngModalDrag]',
    standalone: true
})
export class ModalDragDirective {
  public modalDragService = inject(ModalDragService)
  
  constructor(@Host() protected modal: NzModalComponent) {
    const wrapCls = this.modalDragService.getRandomCls();
    modal.afterOpen.subscribe(() => {
      const modelElement = modal.getElement()!;
      if (!modelElement || modelElement.className.indexOf(ModalDragService.DRAG_CLS_PREFIX) !== -1) {
        return;
      }

      modelElement.classList.add(wrapCls);
      const drag = this.modalDragService.createDragHandler(wrapCls, modal.nzModalType);
      modal.afterClose.subscribe(() => {
        if (drag && !drag.dropped) {
          drag.dispose();
        }
      });
    });
  }
}
