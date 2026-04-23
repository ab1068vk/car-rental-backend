// tests/unit/presentation/validators.test.ts

import { Request, Response, NextFunction } from 'express';
import { validate } from '../../../src/presentation/validators/authValidators';
import { validationResult } from 'express-validator';

// Mock express-validator's validationResult
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

const mockRes = (): Partial<Response> => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('validate middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call next() when there are no validation errors', () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    const req = {} as Request;
    const res = mockRes() as Response;

    validate(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 when there are validation errors', () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ type: 'field', msg: 'Email is required', path: 'email' }],
    });

    const req = {} as Request;
    const res = mockRes() as Response;

    validate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });
});