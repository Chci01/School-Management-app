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
import Students from '../pages/Students';
import Parents from '../pages/Parents';
import Teachers from '../pages/Teachers';
import Personnel from '../pages/Personnel';
import Finances from '../pages/Finances';
import Classes from '../pages/Classes';
import Subjects from '../pages/Subjects';
import Grades from '../pages/Grades';
import Absences from '../pages/Absences';
import Timetable from '../pages/Timetable';
import Exams from '../pages/Exams';
import Messages from '../pages/Messages';
import Library from '../pages/Library';
import Settings from '../pages/Settings';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

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
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'schools',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM']}>
            <Schools />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: 'academic',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Academic />
          </ProtectedRoute>
        ),
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
        path: 'finances',
        element: <Finances />,
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
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Subscription />
          </ProtectedRoute>
        ),
      },
      {
        path: 'students',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Students />
          </ProtectedRoute>
        ),
      },
      {
        path: 'parents',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Parents />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teachers',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Teachers />
          </ProtectedRoute>
        ),
      },
      {
        path: 'personnel',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Personnel />
          </ProtectedRoute>
        ),
      },
      {
        path: 'classes',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Classes />
          </ProtectedRoute>
        ),
      },
      {
        path: 'subjects',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Subjects />
          </ProtectedRoute>
        ),
      },
      {
        path: 'grades',
        element: <Grades />,
      },
      {
        path: 'absences',
        element: <Absences />,
      },
      {
        path: 'timetable',
        element: <Timetable />,
      },
      {
        path: 'exams',
        element: <Exams />,
      },
      {
        path: 'messages',
        element: <Messages />,
      },
      {
        path: 'library',
        element: <Library />,
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_SYSTEM', 'ADMIN_ECOLE']}>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

