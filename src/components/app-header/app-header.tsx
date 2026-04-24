import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const location = useLocation();

  const isConstructorActive =
    location.pathname === '/' || location.pathname.startsWith('/ingredients/');

  const isFeedActive = location.pathname.startsWith('/feed');

  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to="/"
            className={`${styles.link} ${isConstructorActive ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </Link>

          <Link
            to="/feed"
            className={`${styles.link} ml-10 ${isFeedActive ? styles.link_active : ''}`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </Link>
        </div>

        <div className={styles.logo}>
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <Link
          to="/profile"
          className={`${styles.link} ${styles.link_position_last} ${
            isProfileActive ? styles.link_active : ''
          }`}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </Link>
      </nav>
    </header>
  );
};
