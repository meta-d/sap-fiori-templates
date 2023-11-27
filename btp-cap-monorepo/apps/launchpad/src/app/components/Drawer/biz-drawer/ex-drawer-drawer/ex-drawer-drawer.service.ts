import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDrawerOptions } from 'ng-zorro-antd/drawer';
import { DrawerWrapService } from '../../base-drawer';
import { ExDrawerDrawerComponent } from './ex-drawer-drawer.component';

@Injectable({
  providedIn: 'root'
})
export class ExDrawerDrawerService {
  constructor(private drawerWrapService: DrawerWrapService) {}

  protected getContentComponent(): NzSafeAny {
    return ExDrawerDrawerComponent;
  }

  public show(options: NzDrawerOptions = {}, params?: object): Observable<NzSafeAny> {
    return this.drawerWrapService.show(this.getContentComponent(), options, params);
  }
}
