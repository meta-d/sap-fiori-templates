import { ComponentRef, DestroyRef, Inject, inject, Injectable, Injector, TemplateRef, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as _ from 'lodash';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDrawerOptions, NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { GLOBAL_DRAWER_FOOT_TPL_TOKEN } from './global-drawer-foot-tpl/global-drawer-foot-tpl-token';
import { ModalBtnStatus } from './base-modal';
import { GlobalDrawerFootTplComponentToken } from './global-drawer-foot-tpl/global-drawer-foot-tpl.component';

@Injectable({ providedIn: 'root' })
export class DrawerWrapService {
  protected bsDrawerService: NzDrawerService;
  private btnTpl!: TemplateRef<any>;
  drawerRef!: NzDrawerRef;
  destroyRef = inject(DestroyRef);

  constructor(private baseInjector: Injector, @Inject(GLOBAL_DRAWER_FOOT_TPL_TOKEN) private btnComponentRef: ComponentRef<GlobalDrawerFootTplComponentToken>) {
    this.bsDrawerService = this.baseInjector.get(NzDrawerService);
    this.btnTpl = this.btnComponentRef.instance.componentTpl;
    this.btnComponentRef.instance.sureEmitter.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.sure());
    this.btnComponentRef.instance.cancelEmitter.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cancel());
  }

  show(component: Type<NzSafeAny>, drawerOptions: NzDrawerOptions = {}, params: object = {}): Observable<NzSafeAny> {
    const newOptions = this.createDrawerConfig(component, drawerOptions, params);
    this.drawerRef = this.bsDrawerService.create(newOptions);
    return this.drawerRef.afterClose.pipe(
      map(res => {
        return !res ? { status: ModalBtnStatus.Cancel, value: null } : res;
      })
    );
  }

  createDrawerConfig(component: Type<NzSafeAny>, drawerOptions: NzDrawerOptions = {}, params: object = {}): NzDrawerOptions {
    const defaultOptions: NzDrawerOptions = {
      nzContent: component,
      nzClosable: false,
      nzContentParams: {
        params
      },
      nzFooter: drawerOptions.nzFooter || this.btnTpl
    };
    return _.merge(defaultOptions, drawerOptions);
  }

  sure(): void {
    this.drawerRef
      .getContentComponent()
      .getCurrentValue()
      .pipe(
        tap(modalValue => {
          if (!modalValue) {
            return of(false);
          } else {
            return this.drawerRef.close({ status: ModalBtnStatus.Ok, modalValue });
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  cancel(): void {
    this.drawerRef.close({ status: ModalBtnStatus.Cancel, value: null });
  }
}
