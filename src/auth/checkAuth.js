import ApiService from "../services/apiKey.service.js";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "Authorization",
};

export const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    //Check objKey
    const objKey = await ApiService.findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    return error;
  }
};

export const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    console.log("permission::", req.objKey?.permissions);

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    return next();
  };
};