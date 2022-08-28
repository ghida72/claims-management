const BASE_URL =
  "https://claims-management-adb8a-default-rtdb.europe-west1.firebasedatabase.app";

const httpClient = {
  get: async function (path, headers) {
    return await sendRequest(path, "GET", headers);
  },
  post: async function (path, payload, headers) {
    return await sendRequest(path, "POST", payload, headers);
  },
  put: async function (path, payload, headers) {
    return await sendRequest(path, "PUT", payload, headers);
  },
  delete: async function (path, headers) {
    return await sendRequest(path, "DELETE", headers);
  },
};

const sendRequest = async function (path, method, payload, headers) {
  const url = `${BASE_URL}/${path}`;
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
