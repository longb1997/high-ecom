import { CREATED, OK, SuccessResponse } from '@server/core';
import { accessService } from '@server/services';
import { productService } from '@server/services/product.service';

class ProductController {
  createProduct = async (req: any, res: any, next: any) => {
    console.log('req.user', req);
    return new SuccessResponse({
      message: 'Product Created',
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

export const productController = new ProductController();
