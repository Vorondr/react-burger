import type { TIngredient } from './types';

const API_URL = 'https://new-stellarburgers.education-services.ru/api/ingredients';

type TResponse = {
  success: boolean;
  data: TIngredient[];
};

export const getIngredients = async (): Promise<TIngredient[]> => {
  try {
    const response = await fetch(API_URL);
    const result = (await response.json()) as TResponse;
    return result.data;
  } catch (error) {
    console.error(error);
    throw new Error('Ошибка при получении списка ингредиентов!');
  }
};
