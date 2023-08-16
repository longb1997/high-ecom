import JWT from "jsonwebtoken";

export const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    //JWT verify
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("err verify::", err);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};
