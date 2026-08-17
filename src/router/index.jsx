import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../components/Layout'
import ActivityList from '../pages/Marketing/Activity/ActivityList'
import ActivityConfig from '../pages/Marketing/Activity/ActivityConfig'
import ReportList from '../pages/Data/ReportList'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/marketing/activity/list" replace />} />
        <Route path="marketing/activity/list" element={<ActivityList />} />
        <Route path="marketing/activity/config" element={<ActivityConfig />} />
        <Route path="data/reports" element={<ReportList />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
