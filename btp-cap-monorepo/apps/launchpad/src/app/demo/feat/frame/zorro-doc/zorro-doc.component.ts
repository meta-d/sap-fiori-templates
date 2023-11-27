import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'zng-zorro-doc',
  templateUrl: './zorro-doc.component.html',
  styleUrls: ['./zorro-doc.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ZorroDocComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
