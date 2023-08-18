import { shopSchema } from '../models/shop.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { createTokenPair } from '../auth/authUtils';
import { generatePrivateKeyAndPublicKey, getInfoData } from '../utils';
import { keyTokenService } from '@server/services/keyToken.service';
import { AuthFailureError, BadRequestError } from '@server/core';
import { findByEmail } from '@server/services/shop.service';
import { StatusCodes } from '@server/configs';

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
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
    const match = bcrypt.compare(password, foundShop.password);

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

      //save publicKey to database
      const publicKeyString = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError('Error: Key error');
      }

      //convert to rsa publicKey from publicKeyString get from database
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // console.log("publicKeyObject::", publicKeyObject);

      //using privateKey and publicKey to create JWT token
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

      console.log('token::', tokens);

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
