import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from './app/Store'

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))


it('renders user list link', () => {
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: true}
  )
  render(
    //<AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    //</AuthProvider>
      );
  const userlist = screen.getByText(/List of Users/i);
  expect(userlist).toBeInTheDocument();

});

test('renders add new user form link', () =>{
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: true}
  )
  render(    
    //<AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    //</AuthProvider>
    );
  const userform = screen.getByText(/Add New User/i)
  expect(userform).toBeInTheDocument()
})

