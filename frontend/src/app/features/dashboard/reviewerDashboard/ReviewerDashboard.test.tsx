import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from '../../../Store'
import Dashboard from '../Dashboard'
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))

beforeEach(() =>{
  Object.defineProperty(window, 'location', {
    value: {
      assign: jest.fn()
    }
  })
})

it('Renders SDM Dashboard', () => {
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: true,
        user:{
            profile:{
                realmroles:[]
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
  const userListLink = screen.getByText(/Reviewer/i);
  expect(userListLink).toBeInTheDocument();

});