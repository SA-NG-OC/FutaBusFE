'use client';

import { api } from '@/shared/utils/apiClient';
import { toast } from 'react-toastify';

export default function TestToastPage() {
  const testSuccessToast = () => {
    toast.success('This is a success message!');
  };

  const testErrorToast = () => {
    toast.error('This is an error message!');
  };

  const testWarningToast = () => {
    toast.warning('This is a warning message!');
  };

  const testInfoToast = () => {
    toast.info('This is an info message!');
  };

  const testApiError = async () => {
    try {
      // This will trigger 404 error
      await api.get('/non-existent-endpoint');
    } catch (err) {
      console.log('Error caught in component:', err);
    }
  };

  const testApiSuccess = async () => {
    try {
      // Test real API endpoint
      await api.get('/locations');
      toast.success('API call successful!');
    } catch (err) {
      console.log('Error:', err);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[var(--background)]">
      <h1 className="text-3xl font-bold mb-8">Toast Notification Test</h1>
      
      <div className="space-y-4 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Manual Toast Tests:</h2>
        
        <button
          onClick={testSuccessToast}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Show Success Toast
        </button>

        <button
          onClick={testErrorToast}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Show Error Toast
        </button>

        <button
          onClick={testWarningToast}
          className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Show Warning Toast
        </button>

        <button
          onClick={testInfoToast}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Show Info Toast
        </button>

        <hr className="my-8" />

        <h2 className="text-xl font-semibold mb-4">API Error Tests:</h2>

        <button
          onClick={testApiError}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Test API Error (404) - Should show toast automatically
        </button>

        <button
          onClick={testApiSuccess}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Test API Success
        </button>

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 className="font-bold mb-2">Expected Behavior:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Manual toasts: Show immediately when button clicked</li>
            <li>API Error: Toast appears automatically from interceptor</li>
            <li>API Success: Manual toast appears</li>
            <li>All toasts: Auto-close after 3 seconds</li>
            <li>Dark mode: Toast colors adapt to theme</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
