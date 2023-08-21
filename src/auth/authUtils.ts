import { AuthFailureError, NotFoundError } from '@server/core';
import { asyncHandler } from '@server/helper';
import { keyTokenSchema } from '@server/models';
import { keyTokenService } from '@server/services';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id',
};

export const createTokenPair = async (payload: any, publicKey: any, privateKey: any) => {
  try {
    //access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    //JWT verify
    JWT.verify(accessToken, publicKey, (err: any, decode: any) => {
      if (err) {
        console.log('err verify::', err);
      } else {
        console.log('decode verify::', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

// export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   /**
//    * 1 - check userId missing
//    * 2 - get AccessToken
//    * 3 - Verify token
//    * 4 - check user in db
//    * 5 - check keyStore with this userId
//    * 6 - return next
//    */

//   //1 - check userId missing
//   const userId = req.headers[HEADER.CLIENT_ID];

//   if (!userId) throw new AuthFailureError('Invalid Request');

//   //2 - get AccessToken
//   const keyStore = await keyTokenService.findByUserId(userId);

//   if (!keyStore) throw new NotFoundError('Not found keystore');

//   // 3 - Verify token
//   const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
//   if (!accessToken) throw new AuthFailureError('Invalid Request');

//   //4 - check user in db
//   try {
//     const decodeUser = JWT.verify(accessToken, keyStore.publicKey) as any;
//     if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
//     req.keyStore = keyStore;
//     return next();
//   } catch (error) {
//     throw error;
//   }
// });

export const authenticationV2 = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  /**
   * 1 - check userId missing
   * 2 - get AccessToken
   * 3 - Verify token
   * 4 - check user in db
   * 5 - check keyStore with this userId
   * 6 - return next
   */

  //1 - check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError('Invalid Request');

  //2 - get AccessToken
  const keyStore = await keyTokenService.findByUserId(userId);

  if (!keyStore) throw new NotFoundError('Not found keystore');

  // 3 - Verify token
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string;
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey) as any;
      if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  //4 - check user in db
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey) as any;
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User');
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

export const verifyJWT = async (token: any, keySecret: any) => {
  return JWT.verify(token, keySecret);
};
