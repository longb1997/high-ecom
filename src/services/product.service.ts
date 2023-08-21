import { BadRequestError } from '@server/core';
import { clothingSchema, electronicSchema, productSchema } from '@server/models';
import { IProduct, PRODUCT_TYPE_ENUMS } from '@server/types';

//define Factory class to create product
class ProductFactory {
  static async createProduct(type: string, payload: any) {
    switch (type) {
      case 'Electronics':
        return new Electronic(payload);
      case 'Clothing':
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`);
    }
  }
}

//define basic product class

class Product {
  product_name: string;
  product_thumb: string;
  product_price: number;
  product_quantity: number;
  product_type: PRODUCT_TYPE_ENUMS;
  product_attributes: any;
  product_description?: string;
  product_shop?: string;

  constructor({
    product_name,
    product_thumb,
    product_price,
    product_quantity,
    product_type,
    product_attributes,
    product_description,
    product_shop,
  }: any) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_description = product_description;
    this.product_shop = product_shop;
  }

  async createProduct(product_id: any): Promise<any> {
    return await productSchema.create({ ...this, _id: product_id });
  }
}

//Define sub-class for different product type = clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingSchema.create({ ...this.product_attributes, product_shop: this.product_shop });
    if (!newClothing) throw new BadRequestError('Create new Clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Create new Product error');

    return newProduct;
  }
}

//Define sub-class for different product type = electronic
class Electronic extends Product {
  async createProduct() {
    const newClothing = await electronicSchema.create({ ...this.product_attributes, product_shop: this.product_shop });
    if (!newClothing) throw new BadRequestError('Create new Electronic error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Create new Product error');

    return newProduct;
  }
}

export const productService = ProductFactory;
