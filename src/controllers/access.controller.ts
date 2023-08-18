import { CREATED, OK, SuccessResponse } from '@server/core';
import { accessService } from '@server/services';
import { Z_OK } from 'zlib';

class AccessController {
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
