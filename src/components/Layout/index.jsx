import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Avatar, Dropdown } from 'antd'
import {
  UserOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  GiftOutlined,
  SettingOutlined,
  DesktopOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  MessageOutlined,
  MobileOutlined,
  TrophyOutlined,
  GiftFilled,
  DownOutlined,
} from '@ant-design/icons'

const { Header, Content, Sider } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      key: 'marketing',
      icon: <GiftOutlined />,
      label: '营销',
      children: [
        {
          key: 'marketing-automation',
          icon: <RobotOutlined />,
          label: '营销自动化',
        },
        {
          key: 'authorization',
          icon: <SafetyCertificateOutlined />,
          label: '授权管理',
        },
        {
          key: 'wechat-template',
          icon: <MessageOutlined />,
          label: '微信模板管理',
        },
        {
          key: 'sms-template',
          icon: <MobileOutlined />,
          label: '短信模板',
        },
        {
          key: 'coupon',
          icon: <GiftFilled />,
          label: '优惠券管理',
        },
        {
          key: 'activity',
          icon: <TrophyOutlined />,
          label: '活动管理',
          children: [
            {
              key: '/marketing/activity/list',
              label: '活动列表',
            },
            {
              key: 'prize-library',
              label: '奖品库',
            },
            {
              key: 'prize-pool',
              label: '奖池管理',
            },
            {
              key: 'winning-records',
              label: '中奖记录',
            },
          ],
        },
      ],
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户',
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: '内容',
    },
    {
      key: 'task',
      icon: <ScheduleOutlined />,
      label: '任务',
    },
    {
      key: 'data',
      icon: <BarChartOutlined />,
      label: '数据',
    },
    {
      key: 'config',
      icon: <SettingOutlined />,
      label: '配置',
    },
    {
      key: 'system',
      icon: <DesktopOutlined />,
      label: '系统',
    },
  ]

  const getBreadcrumbItems = () => {
    const items = [
      { title: '营销中心' },
      { title: '活动管理' },
    ]

    if (location.pathname.includes('/list')) {
      items.push({ title: '活动列表' })
    } else if (location.pathname.includes('/config')) {
      items.push({ title: '活动配置' })
    }

    return items
  }

  const userMenuItems = [
    { key: 'profile', label: '个人中心' },
    { key: 'settings', label: '账户设置' },
    { key: 'logout', label: '退出登录' },
  ]

  const handleMenuClick = ({ key }) => {
    if (key.startsWith('/')) {
      navigate(key)
    }
  }

  const getSelectedKeys = () => {
    if (location.pathname.includes('/marketing/activity')) {
      return ['/marketing/activity/list']
    }
    return []
  }

  const getOpenKeys = () => {
    return ['marketing', 'activity']
  }

  return (
    <Layout className="app-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={200}
      >
        <div className="logo">
          {!collapsed ? '微盟社区' : '微'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="site-layout-header">
          <div style={{ fontSize: '18px', fontWeight: 500 }}>
            {/* 顶部导航 */}
          </div>
          <div className="header-right">
            <div className="community-name">微盟社区演示-英模会员社区</div>
            <Dropdown menu={{ items: userMenuItems }}>
              <div className="user-info">
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
                <span>小熊猫猫小熊猫猫</span>
                <DownOutlined style={{ fontSize: '12px' }} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content>
          <div className="site-layout-content">
            <div className="breadcrumb-container">
              <Breadcrumb items={getBreadcrumbItems()} />
            </div>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
