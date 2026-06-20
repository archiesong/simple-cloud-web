import { JwtMiddleware } from '../../../src/middleware/jwt.middleware';

describe('JwtMiddleware', () => {
  const createMiddleware = () => {
    const middleware = new JwtMiddleware();
    (middleware as any).whiteList = [
      /^\/$/,
      /^\/api\/auth\/publicKey/,
      /^\/api\/auth\/captcha/,
      /^\/api\/auth\/login/,
      /^\/api\/auth\/logout/,
    ];
    (middleware as any).globalPrefix = 'api';
    return middleware;
  };

  it('skips auth for captcha requests after the frontend dev proxy strips /api', () => {
    const middleware = createMiddleware();

    expect(middleware.match({ path: '/auth/captcha' } as any)).toBe(false);
    expect(middleware.match({ path: '/api/auth/captcha' } as any)).toBe(false);
  });

  it('still requires auth for protected api routes', () => {
    const middleware = createMiddleware();

    expect(middleware.match({ path: '/system/user/page' } as any)).toBe(true);
  });
});
