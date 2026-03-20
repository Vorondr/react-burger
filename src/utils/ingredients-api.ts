import { BASE_URL } from './constants';
import { request } from './request';

import type { TIngredient } from './types';

type TIngredientsResponse = {
  data: TIngredient[];
};

type TOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

const INGREDIENTS_URL = `${BASE_URL}/ingredients`;
const ORDERS_URL = `${BASE_URL}/orders`;

export const getIngredients = (): Promise<TIngredient[]> =>
  request<TIngredientsResponse>(INGREDIENTS_URL).then((data) => data.data);

export const postOrder = (ingredients: string[]): Promise<TOrderResponse> =>
  request<TOrderResponse>(ORDERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });
