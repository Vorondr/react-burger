import type { TIngredient, TOrderStatus } from './types';

export const getStatusText = (status: TOrderStatus): string => {
  if (status === 'done') {
    return 'Выполнен';
  }

  if (status === 'pending') {
    return 'Готовится';
  }

  return 'Создан';
};

export const formatOrderDate = (date: string): string => {
  const orderDate = new Date(date);

  return orderDate.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getOrderIngredients = (
  ingredientIds: string[],
  ingredients: TIngredient[]
): TIngredient[] => {
  return ingredientIds
    .map((id) => ingredients.find((ingredient) => ingredient._id === id))
    .filter((ingredient): ingredient is TIngredient => Boolean(ingredient));
};

export const getOrderPrice = (
  ingredientIds: string[],
  ingredients: TIngredient[]
): number => {
  return getOrderIngredients(ingredientIds, ingredients).reduce(
    (sum, ingredient) => sum + ingredient.price,
    0
  );
};
