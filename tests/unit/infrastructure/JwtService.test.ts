import { JwtService } from '../../../src/infrastructure/auth/JwtService';

// Set environment variables before tests run
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '7d';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    service = new JwtService();
  });

  it('should sign and return a token string', () => {
    const token = service.sign({ userId: 'u-1', email: 'a@b.com', role: 'USER' });
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('should verify a valid token and return the payload', () => {
    const token = service.sign({ userId: 'u-1', email: 'a@b.com', role: 'USER' });
    const decoded = service.verify(token) as any;
    expect(decoded.userId).toBe('u-1');
    expect(decoded.email).toBe('a@b.com');
  });

  it('should return null for an invalid token', () => {
    const result = service.verify('totally.fake.token');
    expect(result).toBeNull();
  });

  it('should return null for a tampered token', () => {
    const token = service.sign({ userId: 'u-1' });
    const tampered = token.slice(0, -5) + 'xxxxx';
    expect(service.verify(tampered)).toBeNull();
  });
});