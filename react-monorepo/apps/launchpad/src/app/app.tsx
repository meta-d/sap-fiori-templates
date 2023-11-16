import { ProConfigProvider } from '@ant-design/pro-components'
import { updateODataConfig } from '@zng/odata'
import { ConfigProvider } from 'antd'
import ProLayout from './components/ProLayout'

// Set odata config globaly
updateODataConfig({ isMockData: import.meta.env.VITE_MOCK_DATA === 'true' })

export default () => {
  if (typeof document === 'undefined') {
    return <div />
  }
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
        overflow: 'auto'
      }}
    >
      <ProConfigProvider hashed={false}>
        <ConfigProvider
          getTargetContainer={() => {
            return document.getElementById('test-pro-layout') || document.body
          }}
        >
          <ProLayout />
        </ConfigProvider>
      </ProConfigProvider>
    </div>
  )
}
