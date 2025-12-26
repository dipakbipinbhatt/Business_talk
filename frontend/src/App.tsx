import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Podcasts from './pages/Podcasts';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import PodcastForm from './pages/Admin/PodcastForm';
import BlogForm from './pages/Admin/BlogForm';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="podcasts" element={<Podcasts />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:id" element={<BlogPost />} />
                    <Route path="contact" element={<Contact />} />
                </Route>
                <Route path="/admin">
                    <Route index element={<AdminLogin />} />
                    <Route path="login" element={<AdminLogin />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="podcast/new" element={<PodcastForm />} />
                    <Route path="podcast/edit/:id" element={<PodcastForm />} />
                    <Route path="blog/new" element={<BlogForm />} />
                    <Route path="blog/edit/:id" element={<BlogForm />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
