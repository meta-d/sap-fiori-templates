import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { PageHeaderComponent } from '@/app/components'
import AMapLoader from '@amap/amap-jsapi-loader'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NgModelSignalDirective } from '@/app/core'

@Component({
  selector: 'zng-gaode-map',
  templateUrl: './gaode-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, NzCardModule, NzInputModule, FormsModule, NzInputModule, NgModelSignalDirective]
})
export class GaodeMapComponent {
  marker: [number, number] = [116.437253, 39.935033]
  markerPosition: string = this.marker.join(',')

  key = signal<string>('')

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      if (this.key()) {
        // api地址
        // https://lbs.amap.com/demo/javascript-api/example/map-lifecycle/map-show
        // 自己去申请一个key，别用我这个Key，多谢
        // 申请地址 https://console.amap.com/dev/key/app
        AMapLoader.load({
          key: this.key(), //首次load必填
          version: '1.4.15',
          AMapUI: {
            version: '1.1',
            plugins: ['overlay/SimpleMarker']
          }
        })
          .then((AMap) => {
            const map = new AMap.Map('container', {
              resizeEnable: true,
              zoom: 11,
              center: [116.397428, 39.90923]
            })

            const marker = new AMap.Marker({
              position: new AMap.LngLat(this.marker[0], this.marker[1]), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              /*  title: '南京',*/
              draggable: true
            })
            marker.on('dragend', () => {
              this.marker = [marker.getPosition()['R'], marker.getPosition()['Q']]
              this.markerPosition = this.marker.join(',')
              this.cdr.markForCheck()
              console.log(this.markerPosition)
            })
            marker.setMap(map)
          })
          .catch((e) => {
            console.error(e)
          })
      }
    })
  }
}
