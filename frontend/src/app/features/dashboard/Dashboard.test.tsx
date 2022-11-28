import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from '../../Store'
import Dashboard from './Dashboard'
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))


it('Renders list of users link', () => {
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: true}
  )
  render(
    //<AuthProvider>
      <Provider store={store}>
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
      </Provider>
    //</AuthProvider>
      );
  const userListLink = screen.getByText(/List of Users/i);
  expect(userListLink).toBeInTheDocument();

});

test('Renders add new user link', () =>{
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: true}
  )
  render(    
    //<AuthProvider>
      <Provider store={store}>
        <MemoryRouter>
            <Dashboard />   
        </MemoryRouter>    
      </Provider>
    //</AuthProvider>
    );
  const addUserLink = screen.getByText(/Add New User/i)
  expect(addUserLink).toBeInTheDocument()
})