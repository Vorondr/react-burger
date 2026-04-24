import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/useForm';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearAuthError, forgotPassword } from '@services/slices/authSlice';

import styles from './forgot-password-page.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect((): (() => void) => {
    dispatch(clearAuthError());

    return (): void => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const { values, handleChange } = useForm({
    email: '',
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    void dispatch(forgotPassword(values.email)).then((resultAction) => {
      if (forgotPassword.fulfilled.match(resultAction)) {
        void navigate('/reset-password');
      }
    });
  };

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <EmailInput
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="Укажите e-mail"
          extraClass="mb-6"
        />

        {error && (
          <p className="text text_type_main-default text_color_error mb-6">{error}</p>
        )}

        <Button htmlType="submit" type="primary" size="large" extraClass="mb-20">
          {isLoading ? 'Загрузка...' : 'Восстановить'}
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
