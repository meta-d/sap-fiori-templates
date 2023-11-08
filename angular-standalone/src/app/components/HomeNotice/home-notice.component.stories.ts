import type { Meta, StoryObj } from '@storybook/angular'
import { HomeNoticeComponent } from './home-notice.component'

const meta: Meta<HomeNoticeComponent> = {
  component: HomeNoticeComponent,
  title: 'HomeNoticeComponent'
}
export default meta
type Story = StoryObj<HomeNoticeComponent>

export const Primary: Story = {
  args: {}
}

export const Heading: Story = {
  args: {}
}
