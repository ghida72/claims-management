import { useState, useCallback } from "react";
/*
This hook manages the execution of an asynchronous operation (i.e. API call). It returns
to the calling component the two state variables (isLoading and error) as well as an execute function which 
takes an asyncOperation function and an onResolved function that is invoked once the
promise returned from asyncOperation completes.
*/
const useLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const execute = useCallback(async (asyncOperation, onResolved) => {
    if (
      typeof asyncOperation !== "function" ||
      typeof onResolved !== "function"
    ) {
      throw new Error(
        "asyncFunction and onResolved should be of type: function"
      );
    }
    setIsLoading(true);
    setError(null);

    try {
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
