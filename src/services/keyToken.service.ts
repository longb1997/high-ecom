import { keyTokenSchema } from '@server/models';
import { Types } from 'mongoose';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }: any) => {
    const filter = { user: userId };
    const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken };
    const options = { upsert: true, new: true };

    const tokens = await keyTokenSchema.findOneAndUpdate(filter, update, options);

    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId: any) => {
    return await keyTokenSchema.findOne({ user: new Types.ObjectId(userId) });
  };

  static deleteKeyById = async (id: any) => {
    return await keyTokenSchema.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken: any) => {
    return await keyTokenSchema.findOne({ refreshTokenUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken: any): Promise<any> => {
    return await keyTokenSchema.findOne({ refreshToken });
  };

  static deleteKeyUserById = async (userId: any) => {
    return await keyTokenSchema.deleteOne({ user: new Types.ObjectId(userId) }).lean();
  };
}

export const keyTokenService = KeyTokenService;
