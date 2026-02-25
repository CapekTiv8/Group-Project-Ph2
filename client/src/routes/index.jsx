import { createBrowserRouter, redirect } from 'react-router';
import Login from '../views/Login';
import BaseLayout from '../views/BaseLayout';
import ChatBox from '../views/ChatBox';
import Home from '../views/Home';
import Register from '../views/Register';

const authLoader = () => {
  const token = localStorage.getItem('token');
  if (!token) throw redirect('/login');
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: BaseLayout,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'chat',
        Component: ChatBox,
        loader: authLoader,
      },
    ],
  },
  {
    path: '/login',
    Component: Login,
    loader : () => {
      const token = localStorage.getItem('token');
      if (token) throw redirect('/');
      return null;
    }
  },
  {
    path: '/register',
    Component: Register,
    loader : () => {
      const token = localStorage.getItem('token');
      if (token) throw redirect('/');
      return null;
    }
  },
]);
