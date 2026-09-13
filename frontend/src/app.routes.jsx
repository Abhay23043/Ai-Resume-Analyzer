import { createBrowserRouter } from 'react-router';
import Login from './features/auth/pages/Login.jsx';
import Register from './features/auth/pages/Register.jsx';
import Home from './features/interview/pages/Home.jsx';
import History from './features/interview/pages/History.jsx';
import Protected from './features/auth/components/Protected.jsx';
import Interview from './features/interview/pages/interview.jsx'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Protected><Home /></Protected>
    },
    {
        path: '/history',
        element: <Protected><History /></Protected>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/interview/:interviewid',
        element: <Protected><Interview /></Protected>
    }
])