import { CREATED, OK, SuccessResponse } from '@server/core';
import { accessService } from '@server/services';
import { Z_OK } from 'zlib';

class AccessController {
  handleRefreshToken = async (req: any, res: any, next: any) => {
    // return new SuccessResponse({
    //   metadata: await accessService.handleRefreshToken(req.body.refreshToken),
    // }).send(res);

    //V2 fixed, no need accessToken

    return new SuccessResponse({
      message: 'Get token success',
      metadata: await accessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  login = async (req: any, res: any, next: any) => {
    return new SuccessResponse({
      metadata: await accessService.login(req.body),
    }).send(res);
  };

  signup = async (req: any, res: any, next: any) => {
    return new CREATED({
      message: 'registered OK!',
      metadata: await accessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  logout = async (req: any, res: any, next: any) => {
    return new SuccessResponse({
      message: 'Logout OK!',
      metadata: await accessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };
}

export const accessController = new AccessController();
