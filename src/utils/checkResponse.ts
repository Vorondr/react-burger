type TErrorResponse = {
  message?: string;
};

const isErrorResponse = (value: unknown): value is TErrorResponse =>
  typeof value === 'object' && value !== null && 'message' in value;

export const checkResponse = async <T>(res: Response): Promise<T> => {
  const data: unknown = await res.json();

  if (res.ok) {
    return data as T;
  }

  const errorMessage =
    isErrorResponse(data) && typeof data.message === 'string'
      ? data.message
      : `Ошибка ${res.status}`;

  return Promise.reject(new Error(errorMessage));
};
