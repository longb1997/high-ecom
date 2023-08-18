import { StatusCodes, ReasonPhrases } from '@server/configs';
import { Response } from 'express';

class SuccessResponse {
  public message;
  public status;
  public metadata;
  constructor({ message = '', statusCode = StatusCodes.OK, reason = ReasonPhrases.OK, metadata = {} }: any) {
    this.message = !message ? reason : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, statusCode = StatusCodes.OK, reason = ReasonPhrases.OK, metadata }: any) {
    super({ message, statusCode, reason, metadata });
  }
}

class CREATED extends SuccessResponse {
  public _options;
  constructor({ options = {}, message, statusCode = StatusCodes.CREATED, reason = ReasonPhrases.CREATED, metadata }: any) {
    super({ message, statusCode, reason, metadata });
    this._options = options;
  }
}

export { CREATED, OK, SuccessResponse };
