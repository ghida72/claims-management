import { useState, useCallback } from "react";

const useLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = useCallback(async (asyncOperation, onResolved) => {
    setIsLoading(true);
    setError(null);
    try {
      //TODO: validate that asyncOperation is a function that returns a Promise
      const resolvedResult = await asyncOperation();
      onResolved(resolvedResult);
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
    setIsLoading(false);
  }, []);
  return { isLoading, error, execute };
};

export default useLoader;
