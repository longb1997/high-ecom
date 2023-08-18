import { keyTokenSchema } from '@server/models';
import { Types } from 'mongoose';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }: any) => {
    // const tokens = await keyTokenSchema.create({
    //   user: userId,
    //   // publicKey: publicKeyString,
    //   publicKey,
    //   privateKey,
    // });

    const filter = { user: userId };
    const update = { publicKey, privateKey, refreshTokenUsed: [] };
    const options = { upsert: true, new: true };

    const tokens = await keyTokenSchema.findOneAndUpdate(filter, update, options);

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId: any) => {
    return await keyTokenSchema.findOne({ user: new Types.ObjectId(userId) }).lean();
  };

  static deleteKeyById = async (id: any) => {
    return await keyTokenSchema.deleteOne(id);
  };
}

export const keyTokenService = KeyTokenService;
