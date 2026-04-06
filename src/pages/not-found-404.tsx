import { Link } from 'react-router-dom';

export const NotFound404 = (): React.JSX.Element => {
  return (
    <main
      style={{
        minHeight: 'calc(100vh - 12px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      <h1 className="text text_type_digits-large">404</h1>
      <p className="text text_type_main-medium">Страница не найдена</p>
      <Link to="/" className="text text_type_main-default">
        Вернуться на главную
      </Link>
    </main>
  );
};
