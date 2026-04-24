import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/useForm.ts';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearAuthError, resetPassword } from '@services/slices/authSlice';
import { isResetPasswordRequested } from '@utils/auth';

import styles from './reset-password-page.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const canOpenPage = isResetPasswordRequested();

  useEffect((): (() => void) => {
    dispatch(clearAuthError());

    return (): void => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const { values: form, handleChange } = useForm({
    password: '',
    token: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    void dispatch(resetPassword(form)).then((resultAction) => {
      if (resetPassword.fulfilled.match(resultAction)) {
        void navigate('/login');
      }
    });
  };

  if (!canOpenPage) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <PasswordInput
          name="password"
          value={form.password}
          onChange={handleChange}
          extraClass="mb-6"
          placeholder="Введите новый пароль"
        />

        <Input
          type="text"
          placeholder="Введите код из письма"
          name="token"
          value={form.token}
          onChange={handleChange}
          extraClass="mb-6"
        />

        {error && (
          <p className="text text_type_main-default text_color_error mb-6">{error}</p>
        )}

        <Button htmlType="submit" type="primary" size="large" extraClass="mb-20">
          {isLoading ? 'Загрузка...' : 'Сохранить'}
        </Button>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?{' '}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};
