import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppLayout from './ui/AppLayout'
import StudentsPage from './pages/StudentPage'
import RoomsPage from './pages/RoomsPage'
import RoomDetailPage from './pages/RoomDetailPage'
import ReportsPage from './pages/ReportsPage'
import 'antd/dist/reset.css'

const qc = new QueryClient()
const router = createBrowserRouter([
  { path: '/', element: <AppLayout />,
    children: [
      { index: true, element: <StudentsPage/> },
      { path: 'students', element: <StudentsPage/> },
      { path: 'rooms', element: <RoomsPage/> },
      { path: 'rooms/:id', element: <RoomDetailPage/> },
      { path: 'reports', element: <ReportsPage/> },
    ],
  },
])

const container = document.getElementById('root')!


const root =
  (window as any).__appRoot ??
  ((window as any).__appRoot = ReactDOM.createRoot(container))

root.render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
