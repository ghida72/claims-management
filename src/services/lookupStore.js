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

//lookups (usually) do not change, so it would be better for performance reasons
//to cache them locally than to fetch them from server on each request.
const cache = {};

const get = async (key, path) => {
  //in case no value exists in the cache for the passed key, get it from the server
  //and cache it for subsequent requests, then return it from the cache.
  if (!cache[key]) {
    cache[key] = await httpClient.get(path);
  }
  return cache[key];
};

export default lookupStore;
