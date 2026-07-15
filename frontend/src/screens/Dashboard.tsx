import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import DashboardCityMapPage from '@/screens/dashboard/DashboardCityMapPage'
import DashboardHomePage from '@/screens/dashboard/DashboardHomePage'
import DashboardLeaderboardPage from '@/screens/dashboard/DashboardLeaderboardPage'
import DashboardNotificationsPage from '@/screens/dashboard/DashboardNotificationsPage'
import DashboardReactionsPage from '@/screens/dashboard/DashboardReactionsPage'
import DashboardReportsPage from '@/screens/dashboard/DashboardReportsPage'
import DashboardSettingsPage from '@/screens/dashboard/DashboardSettingsPage'

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHomePage />} />
        <Route path="city-map" element={<DashboardCityMapPage />} />
        <Route path="reactions" element={<DashboardReactionsPage />} />
        <Route path="reports" element={<DashboardReportsPage />} />
        <Route path="leaderboard" element={<DashboardLeaderboardPage />} />
        <Route path="notifications" element={<DashboardNotificationsPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
