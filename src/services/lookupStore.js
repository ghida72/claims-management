import httpClient from "./httpClient";

const lookupStore = {
  getICDs: async function () {
    return await get("ICDs", "ICD.json");
  },
  getCPTs: async function () {
    return await get("CPTs", "CPT.json");
  },
  getCurrencies: async function () {
    return await get("currencies", "currency.json");
  },
};

const BASE_URL =
  "https://claims-management-adb8a-default-rtdb.europe-west1.firebasedatabase.app/";

const cache = {};

const get = async (key, url) => {
  if (!cache[key]) {
    cache[key] = await httpClient.get(`${BASE_URL}/${url}`);
  }
  return cache[key];
};

export default lookupStore;
