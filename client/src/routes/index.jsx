import { createBrowserRouter, redirect } from 'react-router';
import Login from '../views/Login';
import ChatBox from '../views/ChatBox';
import Register from '../views/Register';

const authLoader = () => {
  const token = localStorage.getItem('token');
  if (!token) throw redirect('/login');
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ChatBox />,
    loader: authLoader,
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
