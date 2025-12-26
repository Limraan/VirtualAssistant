import axios from 'axios';

// Configure axios to suppress 401 errors in console
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 401 errors from console (expected when not logged in)
    if (error.response?.status === 401) {
      // Return the error but don't log it
      return Promise.reject(error);
    }
    // For other errors, let them through normally
    return Promise.reject(error);
  }
);

export default axios;

