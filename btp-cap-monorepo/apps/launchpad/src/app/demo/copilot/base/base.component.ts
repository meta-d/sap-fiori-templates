import { zodToAnnotations } from '@/app/utils'
import { fnCheckForm } from '@/app/utils/tools'
import { NgFor, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { injectCopilotCommand, injectMakeCopilotActionable } from '@metad/ocap-angular/copilot'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzSafeAny } from 'ng-zorro-antd/core/types'
import { NzWaveModule } from 'ng-zorro-antd/core/wave'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzFormModule } from 'ng-zorro-antd/form'
import { NzGridModule } from 'ng-zorro-antd/grid'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NGXLogger } from 'ngx-logger'
import { z } from 'zod'

@Component({
  selector: 'zng-copilot-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule,
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzRadioModule,
    NgIf,
    NzSelectModule,
    NgFor,
    NzButtonModule,
    NzWaveModule
  ]
})
export class CopilotBaseComponent implements OnInit {
  #logger = inject(NGXLogger)
  #fb = inject(FormBuilder)

  @ViewChild('dragTpl', { static: true }) dragTpl!: TemplateRef<NzSafeAny>

  listOfOption = [
    { label: '同事甲', value: '同事甲' },
    { label: '同事乙', value: '同事乙' },
    { label: '同事丙', value: '同事丙' }
  ]

  validateForm!: FormGroup

  #fillFormCommand = injectCopilotCommand({
    name: 'form',
    description: 'Descripe how to fill the form',
    actions: [
      injectMakeCopilotActionable({
        name: 'fill_form',
        description: 'Fill the form',
        argumentAnnotations: [
          {
            name: 'form',
            type: 'object',
            description: '我的工作满意度调查表',
            required: true,
            properties: zodToAnnotations(
              z.object({
                title: z.string().describe('Title of the form'),
                desc: z.string().describe('我的阶段性工作目标'),
                standard: z.string().describe('我的满意度衡量标准'),
                weights: z.number().describe('此调查的权重'),
                isPublic: z.enum(['1', '2', '3']).default('1').describe('是否公开: 1 公开, 2 部分公开, 3 不公开'),
                targetAudiences: z.array(z.enum([
                  '同事甲',
                  '同事乙',
                  '同事丙'
                ])).describe(`'是否公开'为 '2' 的情况下的调查对象`),
              })
            )
          }
        ],
        implementation: async (form) => {
          this.#logger.debug('我的工作满意度调查表, Copilot 填写内容：', form)
          this.validateForm.patchValue({
            ...form,
            weights: [form.weights]
          })

          return `填写完成！`
        }
      })
    ]
  })

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return
    }
  }

  initForm(): void {
    this.validateForm = this.#fb.group({
      title: [null, [Validators.required]],
      date: [null, [Validators.required]],
      desc: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      client: [null],
      invitedCommenter: [null],
      weights: [null],
      isPublic: [null],
      targetAudiences: [null]
    })
  }

  ngOnInit(): void {
    this.initForm()
  }
}
