import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-gray-600 mb-8 text-lg text-center">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white hover:bg-blue-700"
      >
        Go back home
      </Link>
    </div>
  );
}
