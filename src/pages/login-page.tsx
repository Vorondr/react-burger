import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearAuthError, loginUser } from '@services/slices/authSlice';

import styles from './login-page.module.css';

type TLocationState = {
  from?: {
    pathname: string;
  };
};

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  useEffect((): (() => void) => {
    dispatch(clearAuthError());

    return (): void => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    void dispatch(loginUser(form)).then((resultAction) => {
      if (loginUser.fulfilled.match(resultAction)) {
        const state = location.state as TLocationState | null;
        const from = state?.from?.pathname ?? '/';
        void navigate(from, { replace: true });
      }
    });
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>

        <EmailInput
          name="email"
          value={form.email}
          onChange={handleChange}
          extraClass="mb-6"
        />

        <PasswordInput
          name="password"
          value={form.password}
          onChange={handleChange}
          extraClass="mb-6"
        />

        {error && (
          <p className="text text_type_main-default text_color_error mb-6">{error}</p>
        )}

        <Button htmlType="submit" type="primary" size="large" extraClass="mb-20">
          {isLoading ? 'Загрузка...' : 'Войти'}
        </Button>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Вы — новый пользователь?{' '}
            <Link to="/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </p>

          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?{' '}
            <Link to="/forgot-password" className={styles.link}>
              Восстановить пароль
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
