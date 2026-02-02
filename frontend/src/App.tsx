import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';

import GoogleAnalytics from './components/GoogleAnalytics';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Podcasts = lazy(() => import('./pages/Podcasts'));
const Calendar = lazy(() => import('./pages/Calendar'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy load admin pages
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const PodcastForm = lazy(() => import('./pages/Admin/PodcastForm'));
const BlogForm = lazy(() => import('./pages/Admin/BlogForm'));
const ImportPage = lazy(() => import('./pages/Admin/ImportPage'));
const AboutEditor = lazy(() => import('./pages/Admin/AboutEditor'));
const AdminCalendar = lazy(() => import('./pages/Admin/AdminCalendar'));

const Loading = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-700"></div>
    </div>
);

function App() {
    return (
        <HashRouter>
            <ScrollToTop />
            <GoogleAnalytics />
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<AboutUs />} />
                        <Route path="podcasts" element={<Podcasts />} />
                        <Route path="calendar" element={<Calendar />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="blog/:id" element={<BlogPost />} />
                        <Route path="contact" element={<Contact />} />
                    </Route>
                    <Route path="/admin">
                        <Route index element={<AdminLogin />} />
                        <Route path="login" element={<AdminLogin />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="calendar" element={<AdminCalendar />} />
                        <Route path="podcast/new" element={<PodcastForm />} />
                        <Route path="podcast/edit/:id" element={<PodcastForm />} />
                        <Route path="blog/new" element={<BlogForm />} />
                        <Route path="blog/edit/:id" element={<BlogForm />} />
                        <Route path="import" element={<ImportPage />} />
                        <Route path="about" element={<AboutEditor />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </HashRouter>
    );
}

export default App;
