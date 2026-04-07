import { createHashRouter, Navigate } from 'react-router-dom';
import RootLayout from '../components/layouts/RootLayout';
import MobileLogin from '../pages/MobileLogin';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import Schools from '../pages/Schools';
import Users from '../pages/Users';
import Academic from '../pages/Academic';
import Payments from '../pages/Payments';
import Announcements from '../pages/Announcements';
import Documents from '../pages/Documents';
import Health from '../pages/Health';
import Badges from '../pages/Badges';
import Reports from '../pages/Reports';
import Expired from '../pages/Expired';
import Supplies from '../pages/Supplies';
import Conduct from '../pages/Conduct';
import { News } from '../pages/News';
import Signup from '../pages/Signup';
import Activation from '../pages/Activation';
import Subscription from '../pages/Subscription';

export const router = createHashRouter([
  {
    path: '/login',
    element: <MobileLogin />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/expired',
    element: <Expired />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/activate',
    element: <Activation />,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'schools',
        element: <Schools />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'academic',
        element: <Academic />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'payments',
        element: <Payments />,
      },
      {
        path: 'announcements',
        element: <Announcements />,
      },
      {
        path: 'documents',
        element: <Documents />,
      },
      {
        path: 'health',
        element: <Health />,
      },
      {
        path: 'badges',
        element: <Badges />,
      },
      {
        path: 'supplies',
        element: <Supplies />,
      },
      {
        path: 'conduct',
        element: <Conduct />,
      },
      {
        path: 'news',
        element: <News />,
      },
      {
        path: 'subscription',
        element: <Subscription />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
