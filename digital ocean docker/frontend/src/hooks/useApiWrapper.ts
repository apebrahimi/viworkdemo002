import { useState } from 'react';

// This is a wrapper hook to provide the apiCall function needed by DeviceManagementSection
export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = async <T>(apiFunction: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    apiCall,
    isLoading,
    error
  };
};
