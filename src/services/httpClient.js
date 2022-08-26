const httpClient = {
  get: async function (url, headers) {
    return await sendRequest(url, "GET", headers);
  },
  post: async function (url, payload, headers) {
    return await sendRequest(url, "POST", payload, headers);
  },
  put: async function (url, payload, headers) {
    return await sendRequest(url, "PUT", payload, headers);
  },
  delete: async function (url, headers) {
    return await sendRequest(url, "DELETE", headers);
  },
};

const sendRequest = async function (url, method, payload, headers) {
  const response = await fetch(url, {
    method: method,
    body: payload ? JSON.stringify(payload) : null,
    headers: headers,
  });
  if (!response.ok) {
    throw new Error("Couldn't send request. Please try again.");
  }
  const data = await response.json();
  return data;
};

export default httpClient;
