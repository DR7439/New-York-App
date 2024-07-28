import axiosInstance from "../axiosInstance";
const STORE_NAME = "cache";
export default async function fetchWithCache(url) {
  // cache using localStorage
  const cacheKey = `cache-${url}`;
  let cache = localStorage.getItem(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  }
  const response = await axiosInstance.get(url);
  if (response.status === 200) {
    localStorage.setItem(cacheKey, JSON.stringify(response.data));
  }
  return response.data;
}
