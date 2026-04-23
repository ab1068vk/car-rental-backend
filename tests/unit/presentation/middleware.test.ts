// tests/unit/presentation/middleware.test.ts
// Tests for auth, admin, and error middleware

import { Request, Response, NextFunction } from 'express';

// ── Mock logger so tests don't write to disk ──
jest.mock('../../../src/infrastructure/logging/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// ── Mock JwtService ──
jest.mock('../../../src/infrastructure/auth/JwtService');

import { authenticate } from '../../../src/presentation/middleware/authMiddleware';
import { requireAdmin } from '../../../src/presentation/middleware/adminMiddleware';
import { errorHandler, notFoundHandler } from '../../../src/presentation/middleware/errorMiddleware';
import { JwtService } from '../../../src/infrastructure/auth/JwtService';

// Helper to build mock Express req/res/next
const mockReq = (overrides = {}): Partial<Request> => ({
  headers: {},
  method: 'GET',
  path: '/test',
  ip: '127.0.0.1',
  ...overrides,
});

const mockRes = (): Partial<Response> => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

// ── authenticate middleware ──────────────────────────────────

describe('authenticate middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call next() with valid token', () => {
    (JwtService.prototype.verify as jest.Mock).mockReturnValue({
      userId: 'u-1',
      email: 'a@b.com',
      role: 'USER',
    });

    const req = mockReq({
      headers: { authorization: 'Bearer valid.token.here' },
    }) as Request;
    const res = mockRes() as Response;

    authenticate(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user?.userId).toBe('u-1');
  });

  it('should return 401 if no Authorization header', () => {
    const req = mockReq({ headers: {} }) as Request;
    const res = mockRes() as Response;

    authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token does not start with Bearer', () => {
    const req = mockReq({
      headers: { authorization: 'Token abc123' },
    }) as Request;
    const res = mockRes() as Response;

    authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 401 if token is invalid', () => {
    (JwtService.prototype.verify as jest.Mock).mockReturnValue(null);

    const req = mockReq({
      headers: { authorization: 'Bearer bad.token' },
    }) as Request;
    const res = mockRes() as Response;

    authenticate(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

// ── requireAdmin middleware ──────────────────────────────────

describe('requireAdmin middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call next() if user is ADMIN', () => {
    const req = mockReq() as Request;
    (req as any).user = { userId: 'u-1', email: 'a@b.com', role: 'ADMIN' };
    const res = mockRes() as Response;

    requireAdmin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 403 if user is not ADMIN', () => {
    const req = mockReq() as Request;
    (req as any).user = { userId: 'u-1', email: 'a@b.com', role: 'USER' };
    const res = mockRes() as Response;

    requireAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if no user on request', () => {
    const req = mockReq() as Request;
    const res = mockRes() as Response;

    requireAdmin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

// ── errorHandler middleware ──────────────────────────────────

describe('errorHandler middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return 404 for "not found" errors', () => {
    const err = new Error('Car not found');
    const req = mockReq() as Request;
    const res = mockRes() as Response;

    errorHandler(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('should return 400 for validation errors', () => {
    const err = new Error('must be greater than 0');
    const req = mockReq() as Request;
    const res = mockRes() as Response;

    errorHandler(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 403 for permission errors', () => {
    const err = new Error('You do not have permission');
    const req = mockReq() as Request;
    const res = mockRes() as Response;

    errorHandler(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should return 401 for invalid credentials', () => {
    const err = new Error('Invalid email or password');
    const req = mockReq() as Request;
    const res = mockRes() as Response;

    errorHandler(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 500 for unknown errors', () => {
    const err = new Error('Something exploded');
    const req = mockReq() as Request;
    const res = mockRes() as Response;

    errorHandler(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should return 400 for already exists errors', () => {
    const err = new Error('An account with this email already exists');
    const req = mockReq() as Request;
    const res = mockRes() as Response;

    errorHandler(err, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ── notFoundHandler ──────────────────────────────────────────

describe('notFoundHandler', () => {
  it('should return 404 with route info', () => {
    const req = mockReq({ method: 'GET', path: '/api/unknown' }) as Request;
    const res = mockRes() as Response;

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    );
  });
});