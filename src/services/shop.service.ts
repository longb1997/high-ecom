import { shopSchema } from '@server/models';

export const findByEmail = async ({ email, select = { email: 1, password: 2, name: '1', status: 1, roles: 1 } }: any) => {
  console.log('🚀 ~ file: shop.service.ts:6 ~ findByEmail ~ email:', email);
  return await shopSchema.findOne({ email }).select(select).lean();
};
