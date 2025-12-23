import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-maroon-200">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>
                <div className="flex items-center justify-center space-x-4 mt-8">
                    <button
                        onClick={() => window.history.back()}
                        className="btn-secondary flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go Back</span>
                    </button>
                    <Link to="/" className="btn-primary flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
