import { BreakpointObserver } from '@angular/cdk/layout'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzWaveModule } from 'ng-zorro-antd/core/wave'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzResultModule } from 'ng-zorro-antd/result'
import { NzStepsModule } from 'ng-zorro-antd/steps'
import { NzTypographyModule } from 'ng-zorro-antd/typography'

@Component({
  selector: 'zng-success',
  templateUrl: './success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule,
    NzResultModule,
    NzTypographyModule,
    NzGridModule,
    NzStepsModule,
    NzIconModule,
    NzButtonModule,
    NzWaveModule
  ]
})
export class SuccessComponent implements OnInit {
  stepDirection: 'horizontal' | 'vertical' = 'horizontal'
  destroyRef = inject(DestroyRef)
  constructor(private breakpointObserver: BreakpointObserver, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 770px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        let tempDir: 'vertical' | 'horizontal' = 'vertical'
        if (result.matches) {
          tempDir = 'vertical'
        } else {
          tempDir = 'horizontal'
        }
        if (tempDir !== this.stepDirection) {
          this.stepDirection = tempDir
          this.cdr.markForCheck()
        }
      })
  }
}
