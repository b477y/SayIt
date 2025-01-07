export const successResponse = ({ res, message, data, status } = {}) => {
  return res.status(status).json({ successMessage: message, data });
};
