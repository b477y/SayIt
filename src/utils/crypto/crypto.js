import CryptoJS from "crypto-js";

export const encrypt = ({
  plainText = "",
  secretKey = process.env.SECRET_KEY,
} = {}) => {
  const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
  return cipherText;
};

export const decrypt = ({
  cipherText = "",
  secretKey = process.env.SECRET_KEY,
} = {}) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const plainText = bytes.toString(CryptoJS.enc.Utf8);
  return plainText;
};
