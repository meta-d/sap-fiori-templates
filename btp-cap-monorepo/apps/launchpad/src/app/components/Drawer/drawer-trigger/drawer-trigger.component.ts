import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core'

@Component({
  selector: 'zng-drawer-trigger',
  standalone: true,
  imports: [],
  templateUrl: './drawer-trigger.component.html',
  styleUrl: './drawer-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerTriggerComponent {
  @HostBinding('class.zng-drawer__opened')
  @Input() opened: boolean = false
  @Input() side: 'left' | 'right' = 'left'

  @Output() openedChange: EventEmitter<boolean> = new EventEmitter<boolean>()

  toggle() {
    this.opened = !this.opened
    this.openedChange.emit(this.opened)
  }
}
