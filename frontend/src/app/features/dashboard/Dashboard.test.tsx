import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from '../../Store'
import Dashboard from './Dashboard'
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))


it('Renders Internal User Dashboard', () => {
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
  const userListLink = screen.getByText(/Internal User Dashboard/i);
  expect(userListLink).toBeInTheDocument();

});

test('Renders External User Dashboard', () =>{
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
  const addUserLink = screen.getByText(/Internal User Dashboard/i)
  expect(addUserLink).toBeInTheDocument()
})