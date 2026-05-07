import { checkResponse } from './checkResponse';

import type { TOrderByNumberResponse } from './types';

const API_URL = 'https://new-stellarburgers.education-services.ru/api';

export const getOrderByNumberRequest = async (
  orderNumber: string
): Promise<TOrderByNumberResponse> => {
  const response = await fetch(`${API_URL}/orders/${orderNumber}`);

  return checkResponse<TOrderByNumberResponse>(response);
};
