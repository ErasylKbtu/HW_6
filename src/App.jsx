import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import { Loading } from './components/StateViews.jsx';

const About = lazy(() => import('./pages/About.jsx'));
const Assignments = lazy(() => import('./pages/Assignments.jsx'));
const AssignmentDetails = lazy(() => import('./pages/AssignmentDetails.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));

export default function App() {
  return <HashRouter>
    <AuthProvider>
      <Suspense fallback={<Loading text="Opening your workspace…" />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="assignments">
            <Route index element={<Assignments />} />
            <Route path=":id" element={<AssignmentDetails />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </AuthProvider>
  </HashRouter>;
}
