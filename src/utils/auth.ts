const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const RESET_PASSWORD_FLAG_KEY = 'isResetPasswordRequested';

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setResetPasswordRequested = (): void => {
  localStorage.setItem(RESET_PASSWORD_FLAG_KEY, 'true');
};

export const removeResetPasswordRequested = (): void => {
  localStorage.removeItem(RESET_PASSWORD_FLAG_KEY);
};

export const isResetPasswordRequested = (): boolean =>
  localStorage.getItem(RESET_PASSWORD_FLAG_KEY) === 'true';
