import { FiCheckCircle } from 'react-icons/fi';

interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
      <FiCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
      <div>{message}</div>
    </div>
  );
} 