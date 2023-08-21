import { authenticationV2 } from '@server/auth';
import { accessController } from '@server/controllers';
import { asyncHandler } from '@server/helper';
import * as express from 'express';

const accessRouter = express.Router();

//signup
accessRouter.post('/shop/signup', asyncHandler(accessController.signup));
//signin
accessRouter.post('/shop/login', asyncHandler(accessController.login));

// authentication //
accessRouter.use(authenticationV2);

//logout
accessRouter.post('/shop/logout', asyncHandler(accessController.logout));

//handle refresh token
accessRouter.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

export default accessRouter;
