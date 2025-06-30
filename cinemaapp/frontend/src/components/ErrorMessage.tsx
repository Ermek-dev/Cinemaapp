import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-center">
      <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" />
      <p className="text-red-300">{message}</p>
    </div>
  );
};

export default ErrorMessage;