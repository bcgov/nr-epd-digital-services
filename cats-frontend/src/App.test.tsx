import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { useAuth } from 'react-oidc-context';
import { store } from './app/Store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <App />,
    path: '/',
  },
]);

test('Renders Intro', () => {
  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
  const siteName = screen.getByText(/CATS/i);
  expect(siteName).toBeInTheDocument();
});
