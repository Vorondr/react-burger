import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './auth';
import { checkResponse } from './checkResponse';
import { BASE_URL } from './constants';

type TUser = {
  email: string;
  name: string;
};

type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

type TRefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

type TLogoutResponse = {
  success: boolean;
  message: string;
};

type TRegisterData = {
  email: string;
  password: string;
  name: string;
};

type TLoginData = {
  email: string;
  password: string;
};

type TForgotPasswordData = {
  email: string;
};

type TResetPasswordData = {
  password: string;
  token: string;
};

type TPasswordResponse = {
  success: boolean;
  message: string;
};

type TUpdateUserData = {
  name: string;
  email: string;
  password: string;
};

const AUTH_REGISTER_URL = `${BASE_URL}/auth/register`;
const AUTH_LOGIN_URL = `${BASE_URL}/auth/login`;
const AUTH_LOGOUT_URL = `${BASE_URL}/auth/logout`;
const AUTH_TOKEN_URL = `${BASE_URL}/auth/token`;
const PASSWORD_RESET_URL = `${BASE_URL}/password-reset`;
const PASSWORD_RESET_CONFIRM_URL = `${BASE_URL}/password-reset/reset`;

export const registerRequest = async (data: TRegisterData): Promise<TAuthResponse> => {
  const response = await fetch(AUTH_REGISTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return checkResponse<TAuthResponse>(response);
};

export const loginRequest = async (data: TLoginData): Promise<TAuthResponse> => {
  const response = await fetch(AUTH_LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return checkResponse<TAuthResponse>(response);
};

export const logoutRequest = async (): Promise<TLogoutResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return Promise.reject(new Error('Refresh token отсутствует'));
  }

  const response = await fetch(AUTH_LOGOUT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: refreshToken,
    }),
  });

  return checkResponse<TLogoutResponse>(response);
};

export const refreshTokenRequest = async (): Promise<TRefreshResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return Promise.reject(new Error('Refresh token отсутствует'));
  }

  const response = await fetch(AUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: refreshToken,
    }),
  });

  return checkResponse<TRefreshResponse>(response);
};

export const saveAuthData = (data: TAuthResponse): TUser => {
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
};

export const logoutAndClearTokens = async (): Promise<TLogoutResponse> => {
  const response = await logoutRequest();
  clearTokens();
  return response;
};

export const fetchWithRefresh = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    return await checkResponse<T>(response);
  } catch (error) {
    if (!(error instanceof Error)) {
      return Promise.reject(new Error('Неизвестная ошибка'));
    }

    const shouldRefresh =
      error.message === 'jwt expired' ||
      error.message.toLowerCase().includes('jwt expired');

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    const refreshData = await refreshTokenRequest();
    setTokens(refreshData.accessToken, refreshData.refreshToken);

    const headers = new Headers(options.headers ?? {});

    if (headers.has('authorization') || headers.has('Authorization')) {
      headers.set('authorization', refreshData.accessToken);
    }

    const retryResponse = await fetch(url, {
      ...options,
      headers,
    });

    return checkResponse<T>(retryResponse);
  }
};

export const getAuthHeader = (): HeadersInit => {
  const accessToken = getAccessToken();

  return accessToken
    ? {
        authorization: accessToken,
      }
    : {};
};

export const forgotPasswordRequest = async (
  data: TForgotPasswordData
): Promise<TPasswordResponse> => {
  const response = await fetch(PASSWORD_RESET_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return checkResponse<TPasswordResponse>(response);
};

export const resetPasswordRequest = async (
  data: TResetPasswordData
): Promise<TPasswordResponse> => {
  const response = await fetch(PASSWORD_RESET_CONFIRM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return checkResponse<TPasswordResponse>(response);
};

export const getUserRequest = async (): Promise<{ success: boolean; user: TUser }> => {
  return fetchWithRefresh<{ success: boolean; user: TUser }>(`${BASE_URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
};

export const updateUserRequest = async (
  data: TUpdateUserData
): Promise<{ success: boolean; user: TUser }> => {
  return fetchWithRefresh<{ success: boolean; user: TUser }>(`${BASE_URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
};

export type {
  TUser,
  TRegisterData,
  TLoginData,
  TAuthResponse,
  TLogoutResponse,
  TForgotPasswordData,
  TResetPasswordData,
  TPasswordResponse,
  TUpdateUserData,
};
