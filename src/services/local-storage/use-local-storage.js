import { LocalStorage } from "node-localstorage";

export const useLocalStorage = () => {
  const localStorage = new LocalStorage("./db");

  const setString = (key, value) => {
    localStorage.setItem(key, value);
  };

  const setObject = (key, obj) => {
    const objString = JSON.stringify(obj);

    localStorage.setItem(key, objString);
  };

  const getString = (key) => {
    return localStorage.getItem(key);
  };

  const getObject = (key) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing JSON for key "${key}":`, error);
      return null;
    }
  };

  return {
    setString,
    setObject,
    getString,
    getObject,
  };
};
