import { provideLogger, provideTranslate } from '@/app/core'
import { CommonModule } from '@angular/common'
import { provideAnimations } from '@angular/platform-browser/animations'
import {
  applicationConfig,
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj
} from '@storybook/angular'
import { HomeNoticeComponent } from './home-notice.component'
import { provideHttpClient } from '@angular/common/http'

const meta: Meta<HomeNoticeComponent> = {
  component: HomeNoticeComponent,
  title: 'HomeNoticeComponent',
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [],
      imports: [CommonModule]
    }),
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideTranslate(),
        provideLogger()
      ]
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`)
  ]
}
export default meta
type Story = StoryObj<HomeNoticeComponent>

export const Primary: Story = {
  args: {}
}

export const Heading: Story = {
  args: {}
}
