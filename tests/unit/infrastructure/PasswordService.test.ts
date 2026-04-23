import { PasswordService } from '../../../src/infrastructure/auth/PasswordService';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('should hash a password', async () => {
    const hash = await service.hash('myPassword123');
    expect(hash).not.toBe('myPassword123');
    expect(hash.startsWith('$2')).toBe(true); // bcrypt hashes start with $2
  });

  it('should return true for correct password', async () => {
    const hash = await service.hash('myPassword123');
    const result = await service.compare('myPassword123', hash);
    expect(result).toBe(true);
  });

  it('should return false for wrong password', async () => {
    const hash = await service.hash('myPassword123');
    const result = await service.compare('wrongPassword', hash);
    expect(result).toBe(false);
  });
});