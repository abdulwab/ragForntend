import { FiAlertCircle } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
      <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
      <div>{message}</div>
    </div>
  );
} 