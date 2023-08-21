import { authenticationV2 } from '@server/auth';
import { productController } from '@server/controllers';
import { asyncHandler } from '@server/helper';
import * as express from 'express';

const productRouter = express.Router();

// authentication //
productRouter.use(authenticationV2);

// create product//
productRouter.post('', asyncHandler(productController.createProduct));

export default productRouter;
