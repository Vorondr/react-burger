import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { useForm } from '@hooks/useForm';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { registerUser, clearAuthError } from '@services/slices/authSlice';

import styles from './register-page.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const { values: form, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void dispatch(registerUser(form));
  };

  useEffect((): (() => void) => {
    dispatch(clearAuthError());

    return (): void => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>

        <Input
          type="text"
          placeholder="Имя"
          name="name"
          value={form.name}
          onChange={handleChange}
          extraClass="mb-6"
        />

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
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </Button>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?{' '}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
