import CryptoJS from 'crypto-js';

const SECRET_KEY = 'finance-tracker-secure-key-2024';

export const encryptData = <T>(data: T): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
};

export const decryptData = <T>(encryptedData: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString) as T;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

export const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Storage helpers with encryption
export const setEncryptedItem = <T>(key: string, data: T): void => {
  const encrypted = encryptData(data);
  localStorage.setItem(key, encrypted);
};

export const getEncryptedItem = <T>(key: string): T | null => {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  return decryptData<T>(encrypted);
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};
