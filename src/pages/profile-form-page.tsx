import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, type FormEvent } from 'react';

import { useForm } from '@hooks/useForm.ts';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearAuthError, updateUser } from '@services/slices/authSlice';

import styles from './profile-form-page.module.css';

type TProfileForm = {
  name: string;
  email: string;
  password: string;
};

export const ProfileFormPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const initialForm = useMemo<TProfileForm>(
    () => ({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    }),
    [user?.name, user?.email]
  );

  const {
    values: form,
    handleChange,
    setValues,
    resetForm,
  } = useForm<TProfileForm>(initialForm);

  useEffect((): (() => void) => {
    dispatch(clearAuthError());

    return (): void => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect((): void => {
    setValues({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  }, [setValues, user?.email, user?.name]);

  const isChanged =
    form.name !== initialForm.name ||
    form.email !== initialForm.email ||
    form.password !== '';

  const handleCancel = (): void => {
    resetForm(initialForm);
    dispatch(clearAuthError());
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    void dispatch(
      updateUser({
        name: form.name,
        email: form.email,
        password: form.password,
      })
    ).then((resultAction) => {
      if (updateUser.fulfilled.match(resultAction)) {
        resetForm({
          name: resultAction.payload.name,
          email: resultAction.payload.email,
          password: '',
        });
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Имя"
        name="name"
        value={form.name}
        onChange={handleChange}
        icon="EditIcon"
        extraClass="mb-6"
      />

      <Input
        type="email"
        placeholder="Логин"
        name="email"
        value={form.email}
        onChange={handleChange}
        icon="EditIcon"
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

      {isChanged && (
        <div className={styles.actions}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
          >
            Отмена
          </Button>

          <Button htmlType="submit" type="primary" size="medium">
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};
