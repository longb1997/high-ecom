import { keyTokenSchema } from "../models/keyToken.model";

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey
  }: any) => {
    try {
      // const publicKeyString = publicKey.toString();

      const tokens = await keyTokenSchema.create({
        user: userId,
        // publicKey: publicKeyString,
        publicKey,
        privateKey,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error: any) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

export default KeyTokenService;
