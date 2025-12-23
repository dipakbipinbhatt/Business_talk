import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import PodcastForm from './pages/Admin/PodcastForm';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:id" element={<BlogPost />} />
                    <Route path="contact" element={<Contact />} />
                </Route>
                <Route path="/admin">
                    <Route path="login" element={<AdminLogin />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="podcast/new" element={<PodcastForm />} />
                    <Route path="podcast/edit/:id" element={<PodcastForm />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

