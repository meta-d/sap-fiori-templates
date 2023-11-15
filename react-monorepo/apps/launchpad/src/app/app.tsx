// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.less';
import { Button, ConfigProvider, Space, Input, ColorPicker, Divider } from 'antd';
import React from 'react';
import { Products } from '@zng/products';



import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  const [primary, setPrimary] = React.useState('#1677ff');
  
  return (
    <div>

<ColorPicker showText value={primary} onChangeComplete={(color) => setPrimary(color.toHexString())} />
      <Divider />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primary,
          },
        }}
      >
        <Space>
          <Input placeholder="Please Input" />
          <Button type="primary">Submit</Button>
        </Space>
      </ConfigProvider>

      <div className="App">
        <Button type="primary">Button</Button>
      </div>
      <Products />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
