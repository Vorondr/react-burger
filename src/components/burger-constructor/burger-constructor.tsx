import {
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useLocation, useNavigate, type Location } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  selectTotalPrice,
} from '@services/slices/constructorSlice';
import { clearOrder, createOrder } from '@services/slices/orderSlice';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TDraggedConstructorItem = {
  index: number;
};

type TConstructorItemProps = {
  item: {
    uuid: string;
    name: string;
    price: number;
    image: string;
  };
  index: number;
};

type TLocationState = {
  createOrderAfterLogin?: boolean;
  from?: Location;
};

const ConstructorItem = ({ item, index }: TConstructorItemProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement | null>(null);

  const [, dropRef] = useDrop<TDraggedConstructorItem>({
    accept: 'constructor-item',
    hover(draggedItem): void {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, dragRef] = useDrag({
    type: 'constructor-item',
    item: { index },
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(dropRef(ref));

  return (
    <li ref={ref} className={styles.list_item} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <span className={styles.drag}>
        <DragIcon type="primary" />
      </span>

      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={(): void => {
          dispatch(removeIngredient(item.uuid));
        }}
      />
    </li>
  );
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useAppSelector((state) => state.constructorBurger.bun);
  const fills = useAppSelector((state) => state.constructorBurger.ingredients);
  const { orderNumber, isLoading, error } = useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);
  const totalPrice = useAppSelector(selectTotalPrice);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const ingredientIds = bun ? [bun._id, ...fills.map((item) => item._id), bun._id] : [];

  const locationState = location.state as TLocationState | null;
  const shouldCreateOrderAfterLogin = locationState?.createOrderAfterLogin ?? false;

  const [{ isHover }, dropRef] = useDrop<TIngredient, void, { isHover: boolean }>(
    () => ({
      accept: 'ingredient',
      drop: (item): void => {
        dispatch(addIngredient(item));
      },
      collect: (monitor): { isHover: boolean } => ({
        isHover: monitor.isOver(),
      }),
    })
  );

  useEffect((): void => {
    if (!user || !shouldCreateOrderAfterLogin || !bun) {
      return;
    }

    void dispatch(createOrder(ingredientIds)).then((resultAction) => {
      if (createOrder.fulfilled.match(resultAction)) {
        setIsOrderModalOpen(true);
      }

      void navigate(location.pathname, {
        replace: true,
        state: null,
      });
    });
  }, [
    bun,
    dispatch,
    ingredientIds,
    location.pathname,
    navigate,
    shouldCreateOrderAfterLogin,
    user,
  ]);

  const handleOpenOrderModal = (): void => {
    if (!bun) {
      return;
    }

    if (!user) {
      void navigate('/login', {
        state: {
          from: location,
          createOrderAfterLogin: true,
        },
      });
      return;
    }

    void dispatch(createOrder(ingredientIds)).then((resultAction) => {
      if (createOrder.fulfilled.match(resultAction)) {
        setIsOrderModalOpen(true);
      }
    });
  };

  const handleCloseOrderModal = (): void => {
    setIsOrderModalOpen(false);
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  return (
    <section
      ref={dropRef}
      className={`${styles.constructor} ${isHover ? styles.constructor_hover : ''}`}
    >
      <div className={styles.inner}>
        <div className={styles.top}>
          {bun ? (
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          ) : (
            <div className={`${styles.placeholder} ${styles.placeholder_top}`}>
              Выберите булки
            </div>
          )}
        </div>

        <div className={`${styles.scroll} custom-scroll`}>
          {fills.length > 0 ? (
            <ul className={styles.list}>
              {fills.map((item, index) => (
                <ConstructorItem key={item.uuid} item={item} index={index} />
              ))}
            </ul>
          ) : (
            <div className={`${styles.placeholder} ${styles.placeholder_middle}`}>
              Выберите начинку
            </div>
          )}
        </div>

        <div className={styles.bottom}>
          {bun ? (
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          ) : (
            <div className={`${styles.placeholder} ${styles.placeholder_bottom}`}>
              Выберите булки
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.price}>
          <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>

        <Button
          htmlType="button"
          type="primary"
          size="large"
          extraClass="ml-10"
          onClick={handleOpenOrderModal}
          disabled={!bun || isLoading}
        >
          {isLoading ? 'Идет оформление...' : 'Оформить заказ'}
        </Button>
      </div>

      {error && <p className="text text_type_main-default mt-4">Ошибка: {error}</p>}

      {isOrderModalOpen && orderNumber && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </section>
  );
};
