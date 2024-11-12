import LayoutAuth from '@/layouts/LayoutAuth';
import SignIn from '@/pages/auth/SignIn';
import { About, Dashboard, Flow, Setting } from '@/routes/allPages';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'setting',
        element: <Setting />
      },
      {
        path: 'flow',
        element: <Flow />
      }
    ]
  },
  {
    path: '/auth',
    element: <LayoutAuth />,
    children: [
      {
        path: 'sign-in',
        element: <SignIn />
      }
    ]
  }
]);

export default router;
