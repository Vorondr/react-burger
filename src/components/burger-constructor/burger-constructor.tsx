import {
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '@components/modal/modal.tsx';
import { OrderDetails } from '@components/order-details/order-details.tsx';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const bun = ingredients.find((item) => item.type === 'bun');
  const fills = ingredients.filter((item) => item.type !== 'bun');

  const totalPrice = ingredients.reduce((sum, item) => sum + item.price, 0);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOpenOrderModal = (): void => {
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
  };

  return (
    <section className={styles.burger_constructor}>
      {bun && (
        <div className={styles.top}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={styles.middle}>
        <ul className={styles.fills}>
          {fills.map((item) => (
            <li key={item._id} className={styles.item}>
              <DragIcon className={styles.icon} type="primary" />

              <ConstructorElement
                text={item.name}
                price={item.price}
                thumbnail={item.image}
              />
            </li>
          ))}
        </ul>
      </div>

      {bun && (
        <div className={styles.bottom}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}
      <div className={styles.total}>
        <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
        <CurrencyIcon type="primary" />
        <Button
          htmlType="button"
          type="primary"
          size="large"
          extraClass="ml-10"
          onClick={handleOpenOrderModal}
        >
          Оформить заказ
        </Button>
      </div>

      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails orderNumber={12345} />
        </Modal>
      )}
    </section>
  );
};
