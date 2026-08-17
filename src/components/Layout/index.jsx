import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import {
  UserOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  SettingOutlined,
  DesktopOutlined,
  GiftOutlined,
  SafetyCertificateOutlined,
  MessageOutlined,
  MobileOutlined,
  TrophyOutlined,
  RightOutlined,
  PieChartOutlined,
  DownloadOutlined,
} from '@ant-design/icons'

// 顶部一级导航(对照 ui-standard.html)
const topNavItems = [
  { key: 'user', label: '用户', icon: <UserOutlined /> },
  { key: 'content', label: '内容', icon: <FileTextOutlined /> },
  { key: 'activity', label: '活动', icon: <ScheduleOutlined /> },
  { key: 'marketing', label: '营销', icon: <BarChartOutlined /> },
  { key: 'data', label: '数据', icon: <PieChartOutlined /> },
  { key: 'config', label: '配置', icon: <SettingOutlined /> },
  { key: 'system', label: '系统', icon: <DesktopOutlined /> },
]

// 各一级导航对应的侧边栏二级菜单
const sideMenuConfig = {
  marketing: [
    { key: 'marketing-automation', label: '营销自动化', icon: <BarChartOutlined /> },
    { key: 'authorization', label: '授权管理', icon: <SafetyCertificateOutlined /> },
    { key: 'wechat-template', label: '微信模板管理', icon: <MessageOutlined /> },
    { key: 'sms-template', label: '短信模板', icon: <MobileOutlined /> },
    { key: 'coupon', label: '优惠券管理', icon: <GiftOutlined /> },
    {
      key: 'activity',
      label: '活动管理',
      icon: <TrophyOutlined />,
      children: [
        { key: '/marketing/activity/list', label: '活动列表' },
        { key: 'prize-library', label: '奖品库' },
        { key: 'prize-pool', label: '奖池管理' },
        { key: 'winning-records', label: '中奖记录' },
      ],
    },
  ],
  user: [
    { key: 'user-list', label: '用户列表', icon: <UserOutlined /> },
    { key: 'user-tag', label: '用户标签', icon: <UserOutlined /> },
    { key: 'user-group', label: '用户分组', icon: <UserOutlined /> },
  ],
  content: [
    { key: 'content-library', label: '内容库', icon: <FileTextOutlined /> },
    { key: 'content-audit', label: '内容审核', icon: <FileTextOutlined /> },
    { key: 'content-category', label: '内容分类', icon: <FileTextOutlined /> },
  ],
  activity: [
    { key: '/marketing/activity/list', label: '活动列表', icon: <ScheduleOutlined /> },
    { key: 'activity-template', label: '活动模板', icon: <ScheduleOutlined /> },
    { key: 'activity-data', label: '活动数据', icon: <ScheduleOutlined /> },
  ],
  data: [
    { key: '/data/reports', label: '报表下载', icon: <DownloadOutlined /> },
  ],
  config: [
    { key: 'system-config', label: '系统配置', icon: <SettingOutlined /> },
    { key: 'message-config', label: '消息配置', icon: <SettingOutlined /> },
    { key: 'pay-config', label: '支付配置', icon: <SettingOutlined /> },
  ],
  system: [
    { key: 'role-manage', label: '角色管理', icon: <DesktopOutlined /> },
    { key: 'permission-manage', label: '权限管理', icon: <DesktopOutlined /> },
    { key: 'operation-log', label: '操作日志', icon: <DesktopOutlined /> },
  ],
}

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // 根据当前路由推断选中的一级导航
  const getInitialTopNav = () => {
    if (location.pathname.startsWith('/data')) return 'data'
    if (location.pathname.startsWith('/marketing')) return 'marketing'
    return 'marketing'
  }
  const [activeTopNav, setActiveTopNav] = useState(getInitialTopNav())
  // 默认展开"活动管理"子菜单
  const [openSubmenu, setOpenSubmenu] = useState('activity')

  // 当前选中的侧边菜单项
  const getActiveSideKey = () => {
    if (location.pathname.includes('/marketing/activity/list')) return '/marketing/activity/list'
    if (location.pathname.includes('/marketing/activity/config')) return '/marketing/activity/list'
    if (location.pathname.includes('/data/reports')) return '/data/reports'
    return ''
  }

  const getBreadcrumbItems = () => {
    const items = [{ title: '营销中心' }, { title: '活动管理' }]
    if (location.pathname.includes('/list')) {
      items.push({ title: '活动列表' })
    } else if (location.pathname.includes('/config')) {
      items.push({ title: '活动配置' })
    } else if (location.pathname.includes('/data/reports')) {
      items.length = 0
      items.push({ title: '数据' }, { title: '报表下载' })
    }
    return items
  }

  const handleSideMenuClick = (key) => {
    if (key.startsWith('/')) {
      navigate(key)
    }
  }

  const handleTopNavClick = (key) => {
    setActiveTopNav(key)
    // 切换一级导航时,如果有对应路由可跳转则跳转,这里仅高亮
  }

  const toggleSubmenu = (key) => {
    setOpenSubmenu(openSubmenu === key ? '' : key)
  }

  // 渲染侧边栏菜单
  const renderSideMenu = (items) => {
    return items.map((item) => {
      if (item.children) {
        const isOpen = openSubmenu === item.key
        const hasActiveChild = item.children.some((c) => c.key === getActiveSideKey())
        return (
          <div key={item.key} className="menu-submenu">
            <div
              className={`menu-submenu-title ${hasActiveChild ? 'active' : ''}`}
              onClick={() => toggleSubmenu(item.key)}
              style={hasActiveChild ? { color: 'var(--primary-color)', fontWeight: 500 } : {}}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span className="menu-icon">{item.icon}</span>
                {item.label}
              </span>
              <span className={`submenu-arrow ${isOpen ? 'open' : ''}`}>
                <RightOutlined />
              </span>
            </div>
            {isOpen && (
              <div>
                {item.children.map((child) => (
                  <div
                    key={child.key}
                    className={`menu-item ${getActiveSideKey() === child.key ? 'active' : ''}`}
                    onClick={() => handleSideMenuClick(child.key)}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }
      return (
        <div
          key={item.key}
          className={`menu-item ${getActiveSideKey() === item.key ? 'active' : ''}`}
          onClick={() => handleSideMenuClick(item.key)}
        >
          <span className="menu-icon">{item.icon}</span>
          {item.label}
        </div>
      )
    })
  }

  return (
    <div className="app-layout">
      <aside className="sider">
        <div className="sider-logo">
          <div className="sider-logo-icon">A</div>
          <span>Admin</span>
        </div>
        <nav className="menu">{renderSideMenu(sideMenuConfig[activeTopNav] || [])}</nav>
      </aside>
      <main className="main">
        <header className="header">
          <nav className="header-nav">
            {topNavItems.map((item) => (
              <div
                key={item.key}
                className={`nav-item ${activeTopNav === item.key ? 'active' : ''}`}
                onClick={() => handleTopNavClick(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="header-user">
            <span>荣耀管理员</span>
            <div className="user-avatar">系</div>
          </div>
        </header>
        <div className="content">
          <div className="breadcrumb">
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout
