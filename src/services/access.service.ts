import { shopSchema } from '../models/shop.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { createTokenPair, verifyJWT } from '../auth/authUtils';
import { generatePrivateKeyAndPublicKey, getInfoData } from '../utils';
import { keyTokenService } from '@server/services/keyToken.service';
import { AuthFailureError, BadRequestError, ForBiddenError } from '@server/core';
import { findByEmail } from '@server/services/shop.service';
import { StatusCodes } from '@server/configs';
import { keyTokenSchema } from '@server/models';

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static handleRefreshToken = async (refreshToken: string) => {
    /**
     * 1 - checktoken used before?
     *
     */

    //1
    const foundRefreshTokenUsedBefore = await keyTokenService.findByRefreshTokenUsed(refreshToken);

    if (foundRefreshTokenUsedBefore) {
      const { userId, email }: any = await verifyJWT(refreshToken, foundRefreshTokenUsedBefore.privateKey);
      // delete
      await keyTokenService.deleteKeyUserById(userId);
      throw new ForBiddenError('Something was wrong, please login again!');
    }

    console.log('refreshToken', refreshToken);

    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);

    console.log('holderToken', holderToken);

    if (!holderToken) throw new AuthFailureError('Shop not registed 1');

    //verify token
    const { userId, email }: any = await verifyJWT(refreshToken, holderToken.privateKey);

    //check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop not Register 2');

    //create new tokens

    // 4 - Generate tokens
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);

    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens?.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async ({ keyStore }: any) => {
    const deletedKeyStore = keyTokenService.deleteKeyById(keyStore._id);
    return deletedKeyStore;
  };

  static login = async ({ email, password, refreshToken }: any) => {
    /**
     * 1 - Check email in dbs
     * 2 - compare password
     * 3 - Create AccessToken and RefreshToken
     * 4 - Generate tokens
     * 5 - Get data return login
     */

    //1 - Check email in dbs
    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new BadRequestError('Shop not Register', StatusCodes.NOT_FOUND);

    //2 - compare password
    const match = await bcrypt.compare(password, foundShop.password);

    console.log({ password, fp: foundShop.password, match });

    if (!match) throw new AuthFailureError('Authentication Error');

    // 3 - Create AT
    const { privateKey, publicKey } = generatePrivateKeyAndPublicKey();

    const { _id: userId } = foundShop;
    // 4 - Generate tokens
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);

    await keyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens?.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ['_id', 'email', 'name'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }: any) => {
    //check email exist
    const holderShop = await shopSchema.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Error: Shop Already Register');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopSchema.create({
      name,
      email,
      password: passwordHash,
      roles: RoleShop.SHOP,
    });

    if (newShop) {
      // Created privateKey and publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const { privateKey, publicKey } = generatePrivateKeyAndPublicKey();
      console.log({ privateKey, publicKey });

      //using privateKey and publicKey to create JWT token
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

      console.log('token::', tokens);

      //save publicKey to database
      const publicKeyString = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens?.refreshToken,
      });

      if (!publicKeyString) {
        throw new BadRequestError('Error: Key error');
      }

      return {
        shop: getInfoData({
          fields: ['_id', 'email', 'name'],
          object: newShop,
        }),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

export const accessService = AccessService;
