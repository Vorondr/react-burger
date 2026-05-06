import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import {
  type Location,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { ProtectedRoute } from '@components/protected-route';
import { FeedPage } from '@pages/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password-page';
import { Home } from '@pages/home';
import { IngredientPage } from '@pages/ingredient';
import { LoginPage } from '@pages/login-page';
import { NotFound404 } from '@pages/not-found-404';
import { OrderPage } from '@pages/order-page';
import { ProfileFormPage } from '@pages/profile-form-page';
import { ProfileOrdersPage } from '@pages/profile-orders-page';
import { ProfilePage } from '@pages/profile-page';
import { RegisterPage } from '@pages/register-page';
import { ResetPasswordPage } from '@pages/reset-password-page';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { checkUserAuth } from '@services/slices/authSlice';
import { fetchIngredients } from '@services/slices/ingredientsSlice';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as TLocationState | null;
  const background = locationState?.background;

  const { isLoading: isIngredientsLoading, error: ingredientsError } = useAppSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const handleCloseModal = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (ingredientsError) {
    return <p className="text text_type_main-medium">Ошибка: {ingredientsError}</p>;
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background ?? location}>
        <Route path="/" element={<Home />} />

        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:id" element={<OrderPage />} />

        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileFormPage />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
          <Route path="orders/:id" element={<OrderPage />} />
        </Route>

        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal onClose={handleCloseModal} title="Детали ингредиента">
                <IngredientPage />
              </Modal>
            }
          />

          <Route
            path="/feed/:id"
            element={
              <Modal onClose={handleCloseModal}>
                <OrderInfo isModal />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:id"
            element={
              <Modal onClose={handleCloseModal}>
                <OrderInfo isModal />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
