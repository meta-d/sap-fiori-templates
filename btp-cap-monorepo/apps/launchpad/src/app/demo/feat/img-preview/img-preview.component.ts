import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzWaveModule } from 'ng-zorro-antd/core/wave'
import { NzImageModule, NzImageService } from 'ng-zorro-antd/image'
import { NzSpaceModule } from 'ng-zorro-antd/space'

@Component({
  selector: 'zng-img-preview',
  templateUrl: './img-preview.component.html',
  styleUrls: ['./img-preview.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzImageModule, NzSpaceModule, NzButtonModule, NzWaveModule]
})
export class ImgPreviewComponent {
  constructor(private nzImageService: NzImageService) {}
  onClick(): void {
    const images = [
      {
        src: 'https://img.alicdn.com/tfs/TB1g.mWZAL0gK0jSZFtXXXQCXXa-200-200.svg',
        width: '200px',
        height: '200px',
        alt: 'ng-zorro'
      },
      {
        src: 'https://img.alicdn.com/tfs/TB1Z0PywTtYBeNjy1XdXXXXyVXa-186-200.svg',
        width: '200px',
        height: '200px',
        alt: 'angular'
      }
    ]
    this.nzImageService.preview(images, { nzZoom: 1.5, nzRotate: 0 })
  }
}
