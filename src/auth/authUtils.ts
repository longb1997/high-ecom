import JWT from "jsonwebtoken";

export const createTokenPair = async (payload: any, publicKey: any, privateKey: any) => {
  try {
    //access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    //JWT verify
    JWT.verify(accessToken, publicKey, (err: any, decode: any) => {
      if (err) {
        console.log("err verify::", err);
      } else {
        console.log("decode verify::", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};
