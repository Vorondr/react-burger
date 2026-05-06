import { NavLink, Outlet } from 'react-router-dom';

import { useAppDispatch } from '@services/hooks';
import { logoutUser } from '@services/slices/authSlice';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
    `${styles.link} text text_type_main-medium ${
      isActive ? styles.link_active : 'text_color_inactive'
    }`;

  const handleLogout = (): void => {
    void dispatch(logoutUser());
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <div className={styles.sidebar}>
          <nav className={styles.nav}>
            <NavLink to="/profile" end className={getLinkClassName}>
              Профиль
            </NavLink>

            <NavLink to="/profile/orders" className={getLinkClassName}>
              История заказов
            </NavLink>

            <button
              type="button"
              className={`${styles.logout} text text_type_main-medium text_color_inactive`}
              onClick={handleLogout}
            >
              Выход
            </button>
          </nav>

          <p
            className={`${styles.description} text text_type_main-default text_color_inactive`}
          >
            В этом разделе вы можете просмотреть свою историю заказов
          </p>
        </div>

        <Outlet />
      </section>
    </main>
  );
};
