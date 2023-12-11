import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import FileSaver from 'file-saver';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { DownloadService } from '@/app/core';

@Component({
  selector: 'zng-download',
  templateUrl: './download.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzCardModule, NzButtonModule, NzWaveModule]
})
export class DownloadComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  constructor(private downloadService: DownloadService) {}

  ngOnInit(): void {}

  fileStreamDownload(): void {
    const downloadDto = {
      downloadUrl: `/api/file/图纸实际材料量导入模板.xlsx`
    };
    this.downloadService
      .fileStreamDownload(downloadDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        const blob = new Blob([res], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, '材料库导入模板.xlsx');
      });
  }
}
