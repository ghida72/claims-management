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

const cache = {};

const get = async (key, path) => {
  if (!cache[key]) {
    cache[key] = await httpClient.get(path);
  }
  return cache[key];
};

export default lookupStore;
