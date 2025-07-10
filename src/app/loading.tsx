import { FiLoader } from 'react-icons/fi';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <FiLoader className="animate-spin text-blue-600 mb-4" size={48} />
      <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
    </div>
  );
} 