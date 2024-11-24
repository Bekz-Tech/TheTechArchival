import { useState, useCallback } from 'react';

/**
 * A custom hook to handle API requests (GET, POST, PUT, DELETE).
 * @param {string} url - The API URL to call.
 * @returns {Object} The hook's return object includes loading, data, error, and the API call function.
 */
const useApi = (url) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('');
  const [error, setError] = useState(null);

  /**
   * The function that calls an API with the specified method and parameters.
   * @param {string} method - The HTTP method (GET, POST, PUT, DELETE).
   * @param {Object|null} body - The request body (for POST, PUT methods).
   * @param {Object} config - Additional configurations like headers (optional).
   * @param {string} url - The API endpoint to be called.
   */
  const callApi = useCallback(
    async (method = 'GET', body = null, config = {}) => {
      console.log('called')

      setLoading(true);
      setError(null);

      // Set up the headers, assuming JSON content type
      const headers = {
        'Content-Type': 'application/json',
        ...config.headers, // Allow custom headers to be passed in
      };

      // Set up the request options
      const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null, // Only include body if it exists
      };

      try {
        const response = await fetch(url, options);
        console.log(response)

        // If the response is not ok (status not in the 200 range), throw an error
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response data as JSON
        const responseData = await response.json();
        console.log(responseData)
        setData(responseData); // Only set if valid data is received
        console.log(data)

      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    },[] // No dependencies, so this won't change unless the component re-renders
  );

  return {
    loading,
    data,
    error,
    callApi, // Expose callApi so the component can call it when needed
  };
};

export default useApi;
