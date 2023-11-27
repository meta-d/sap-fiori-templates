import { PageHeaderComponent } from '@/app/components';
import { LazyService } from '@/app/core';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { NzCardModule } from 'ng-zorro-antd/card';

declare var BMap: any;

@Component({
  selector: 'zng-baidu-map',
  templateUrl: './baidu-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule]
})
export class BaiduMapComponent implements OnInit {

  constructor(private lazyService: LazyService) {}

  ngOnInit(): void {
    this.lazyService.loadScript('http://api.map.baidu.com/getscript?v=2.0').then(() => {
      const map = new BMap.Map('map'); //创建地图实例
      const point = new BMap.Point(116.404, 39.915); //创建点坐标
      map.centerAndZoom(point, 15); //初始化地图，设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    });
  }
}
