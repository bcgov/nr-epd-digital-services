import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from '../../../Store'
import Dashboard from '../Dashboard'
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))


it('Renders SDM Dashboard', () => {
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: true,
        user:{
            profile:{
                realmroles:["sdm-role"]
            }
        }
    }
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
  const userListLink = screen.getByText(/SDM/i);
  expect(userListLink).toBeInTheDocument();

});