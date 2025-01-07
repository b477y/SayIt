import bcrypt from "bcryptjs";

export const generateHash = ({
  inputString = "",
  saltFactor = parseInt(process.env.SALT_ROUNDS),
} = {}) => {
  const hashResult = bcrypt.hashSync(inputString, saltFactor);
  return hashResult;
};

export const compareHash = ({ inputString = "", hashedString = "" } = {}) => {
  const isMatch = bcrypt.compareSync(inputString, hashedString);
  return isMatch;
};
