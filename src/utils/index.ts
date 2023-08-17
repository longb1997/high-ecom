import _ from "lodash";

export const getInfoData = ({ fields = [], object = {} }: any): any => {
  return _.pick(object, fields);
};
