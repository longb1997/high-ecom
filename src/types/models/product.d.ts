export enum PRODUCT_TYPE_ENUMS {
  Electronics = 'Electronics',
  Clothing = 'Clothing',
  Furniture = 'Furniture',
}

export interface IProduct {
  product_name: string;
  product_thumb: string;
  product_price: number;
  product_quantity: number;
  product_type: PRODUCT_TYPE_ENUMS;
  product_attributes: any;
  product_description?: string;
  product_shop?: string;
}
