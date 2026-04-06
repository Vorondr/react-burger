import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation, type Location } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const locationState = location.state as TLocationState | null;

  const { user, isAuthChecked } = useAppSelector((state) => state.auth);

  const isAuthorized = Boolean(user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthorized) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthorized) {
    const from = locationState?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  return children;
};
