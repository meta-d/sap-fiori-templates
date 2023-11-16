import {
  CaretDownFilled,
  DoubleRightOutlined,
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined
} from '@ant-design/icons'
import { PageContainer, ProCard, ProLayout, SettingDrawer } from '@ant-design/pro-components'
import { css } from '@emotion/css'
import { Button, Divider, Dropdown, Input, Popover, theme } from 'antd'
import React, { useState } from 'react'
import { Link, Routes, useLocation } from 'react-router-dom'
import defaultProps, { renderRoutes, routes } from '../../config/routes'
import { usePersonalization, useUser } from '../../core/'

const Item: React.FC<{ children: React.ReactNode }> = (props) => {
  const { token } = theme.useToken()
  return (
    <div
      className={css`
        color: ${token.colorTextSecondary};
        font-size: 14px;
        cursor: pointer;
        line-height: 22px;
        margin-bottom: 8px;
        &:hover {
          color: ${token.colorPrimary};
        }
      `}
      style={{
        width: '33.33%'
      }}
    >
      {props.children}
      <DoubleRightOutlined
        style={{
          marginInlineStart: 4
        }}
      />
    </div>
  )
}

const List: React.FC<{ title: string; style?: React.CSSProperties }> = (props) => {
  const { token } = theme.useToken()

  return (
    <div
      style={{
        width: '100%',
        ...props.style
      }}
    >
      <div
        style={{
          fontSize: 16,
          color: token.colorTextHeading,
          lineHeight: '24px',
          fontWeight: 500,
          marginBlockEnd: 16
        }}
      >
        {props.title}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap'
        }}
      >
        {new Array(6).fill(1).map((_, index) => {
          return <Item key={index}>具体的解决方案-{index}</Item>
        })}
      </div>
    </div>
  )
}

const MenuCard = () => {
  const { token } = theme.useToken()
  const [products] = useState([
    {
      name: 'ocap',
      label: '元数（Metad）分析云是一款基于云计算的集多维建模、指标管理、BI 展示于一体的敏捷数据分析平台。',
      icon: 'favicon.svg',
      url: 'https://mtda.cloud/'
    },
    {
      name: 'sap application',
      label: '现代, 敏捷, 企业级开发架构，下一代企业应用开发模式。',
      icon: 'favicon.svg',
      url: 'https://mtda.cloud/sap'
    }
  ])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Divider
        style={{
          height: '1.5em'
        }}
        type="vertical"
      />
      <Popover
        placement="bottom"
        overlayStyle={{
          width: 'calc(100vw - 24px)',
          padding: '24px',
          paddingTop: 8,
          height: '307px',
          borderRadius: '0 0 6px 6px'
        }}
        content={
          <div style={{ display: 'flex', padding: '32px 40px' }}>
            <div style={{ flex: 1 }}>
              <List title="金融解决方案" />
              <List
                title="其他解决方案"
                style={{
                  marginBlockStart: 32
                }}
              />
            </div>

            <div
              style={{
                width: '308px',
                borderInlineStart: '1px solid ' + token.colorBorder,
                paddingInlineStart: 16
              }}
            >
              <div
                className={css`
                  font-size: 14px;
                  color: ${token.colorText};
                  line-height: 22px;
                `}
              >
                最近使用
              </div>
              {products.map(({ name, label, icon, url }, index) => {
                return (
                  <a
                    href={url}
                    key={index}
                    className={css`
                      border-radius: 4px;
                      padding: 16px;
                      margin-top: 4px;
                      display: flex;
                      cursor: pointer;
                      &:hover {
                        background-color: ${token.colorBgTextHover};
                      }
                    `}
                  >
                    <img
                      src={icon}
                      alt="logo"
                      style={{
                        width: 30
                      }}
                    />
                    <div
                      style={{
                        marginInlineStart: 14
                      }}
                    >
                      <div
                        className={css`
                          font-size: 14px;
                          color: ${token.colorText};
                          line-height: 22px;
                        `}
                      >
                        {name}
                      </div>
                      <div
                        className={css`
                          font-size: 12px;
                          color: ${token.colorTextSecondary};
                          line-height: 20px;
                        `}
                      >
                        {label}
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        }
      >
        <div
          style={{
            color: token.colorTextHeading,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            gap: 4,
            paddingInlineStart: 8,
            paddingInlineEnd: 12,
            alignItems: 'center'
          }}
          className={css`
            &:hover {
              background-color: ${token.colorBgTextHover};
            }
          `}
        >
          <span>原应用</span>
          <CaretDownFilled />
        </div>
      </Popover>
    </div>
  )
}

const SearchInput = () => {
  const { token } = theme.useToken()
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 24
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <Input
        style={{
          borderRadius: 4,
          marginInlineEnd: 12,
          backgroundColor: token.colorBgTextHover
        }}
        prefix={
          <SearchOutlined
            style={{
              color: token.colorTextLightSolid
            }}
          />
        }
        placeholder="搜索方案"
        bordered={false}
      />
      <PlusCircleFilled
        style={{
          color: token.colorPrimary,
          fontSize: 24
        }}
      />
    </div>
  )
}

const MyLayout = () => {

  const [settings, setSetting] = usePersonalization()
  const [user ] = useUser()

  const location = useLocation()
  const [num, setNum] = useState(40)
  return (
    <ProLayout
      prefixCls="my-prefix"
      logo="favicon.svg"
      title="Fiori App"
      bgLayoutImgList={[
        {
          src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
          left: 85,
          bottom: 100,
          height: '303px'
        },
        {
          src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
          bottom: -68,
          right: -45,
          height: '303px'
        },
        {
          src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
          bottom: 0,
          left: 0,
          width: '331px'
        }
      ]}
      {...defaultProps}
      location={location}
      token={{
        header: {
          colorBgMenuItemSelected: 'rgba(0,0,0,0.04)'
        }
      }}
      siderMenuType="group"
      menu={{
        collapsedShowGroupTitle: true
      }}
      avatarProps={{
        src: 'assets/images/default-user.jpg',
        size: 'small',
        title: user?.name,
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录'
                  }
                ]
              }}
            >
              {dom}
            </Dropdown>
          )
        }
      }}
      actionsRender={(props) => {
        if (props.isMobile) return []
        if (typeof window === 'undefined') return []
        return [
          props.layout !== 'side' && document.body.clientWidth > 1400 ? <SearchInput /> : undefined,
          <InfoCircleFilled key="InfoCircleFilled" />,
          <QuestionCircleFilled key="QuestionCircleFilled" />,
          <GithubFilled key="GithubFilled" />
        ]
      }}
      headerTitleRender={(logo, title, _) => {
        const defaultDom = (
          <a href="/">
            {logo}
            {title}
          </a>
        )
        if (typeof window === 'undefined') return defaultDom
        if (document.body.clientWidth < 1400) {
          return defaultDom
        }
        if (_.isMobile) return defaultDom
        return (
          <>
            {defaultDom}
            <MenuCard />
          </>
        )
      }}
      menuFooterRender={(props) => {
        if (props?.collapsed) return undefined
        return (
          <div
            style={{
              textAlign: 'center',
              paddingBlockStart: 12
            }}
          >
            <div>© 2023</div>
            <div>by Metad Team</div>
          </div>
        )
      }}
      onMenuHeaderClick={(e) => console.log(e)}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom
        }
        if (menuItemProps.path && location.pathname !== menuItemProps.path) {
          return (
            <Link to={menuItemProps.path} target={menuItemProps.target}>
              {defaultDom}
            </Link>
          )
        }
        return defaultDom
      }}
      {...settings}
    >
      <PageContainer
        token={{
          paddingInlinePageContainerContent: num
        }}
        extra={[
          <Button key="3">操作</Button>,
          <Button key="2">操作</Button>,
          <Button
            key="1"
            type="primary"
            onClick={() => {
              setNum(num > 0 ? 0 : 40)
            }}
          >
            主操作
          </Button>
        ]}
        subTitle="简单的描述"
        footer={[
          <Button key="3">重置</Button>,
          <Button key="2" type="primary">
            提交
          </Button>
        ]}
      >
        <ProCard
          style={{
            height: '200vh',
            minHeight: 800,
          }}
        >
          <Routes>{renderRoutes(routes)}</Routes>
        </ProCard>
      </PageContainer>

      <SettingDrawer
        hideHintAlert={true}
        hideCopyButton={true}
        enableDarkTheme
        getContainer={(e: unknown) => {
          if (typeof window === 'undefined') return e
          return document.getElementById('test-pro-layout')
        }}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting)
        }}
        disableUrlParams={true}
      />
    </ProLayout>
  )
}

export default MyLayout
