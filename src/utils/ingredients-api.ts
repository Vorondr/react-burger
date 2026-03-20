import { request } from '../utils/request';

import type { TIngredient } from './types';

const API_URL = 'https://new-stellarburgers.education-services.ru/api/ingredients';

type TResponse = {
  success: boolean;
  data: TIngredient[];
};

export const getIngredients = async (): Promise<TIngredient[]> => {
  const data = await request<TResponse>(API_URL);
  return data.data;
};
