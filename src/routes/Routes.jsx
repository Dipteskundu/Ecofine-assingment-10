import { createBrowserRouter } from 'react-router';
import MainLayout from '../MainLayout/MainLayout';
import AddIssues from '../pages/AddIssues';
import AllIssues from '../pages/AllIssues';
import MyIssues from '../pages/MyIssues';
import MyContribution from '../pages/MyContribution';
import Home from '../pages/Home';
import IssueDetails from '../pages/IssueDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ProtectedRoute from '../components/ProtectedRoute';

const Routes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children:[
            {
                index: true,
                element: <Home />
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
                path: '/forgot-password',
                element: <ForgotPassword />
            },
            {
                path: '/all-issues',
                element: <AllIssues />
            },
            {
                path: '/addIssues',
                element: (
                    <ProtectedRoute>
                        <AddIssues />
                    </ProtectedRoute>
                )
            },
            {
                path: '/my-issues',
                element: (
                    <ProtectedRoute>
                        <MyIssues />
                    </ProtectedRoute>
                )
            },
            {
                path: '/my-contribution',
                element: (
                    <ProtectedRoute>
                        <MyContribution />
                    </ProtectedRoute>
                )
            },
            {
                path: '/issue-details',
                element: <IssueDetails />
            }
        ]
    }
])

export default Routes;