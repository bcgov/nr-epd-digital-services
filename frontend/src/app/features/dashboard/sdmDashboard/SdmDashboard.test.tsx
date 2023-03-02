import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from '../../../Store'
import Dashboard from '../Dashboard'
import { MemoryRouter } from 'react-router-dom';
import { getSDMUserRole } from '../../../helpers/envManager';

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))

describe('testing sdm dashboards', ()=>{
  const env = process.env
  beforeEach(()=>{
    jest.resetModules()
    process.env = {REACT_APP_SDM_ROLE_NAME:"sdm-role", ...env}
  })

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
    
    console.log("Sdm user role? " + getSDMUserRole())
    render(
      //<AuthProvider>
        <Provider store={store}>
          <MemoryRouter>
              <Dashboard />
          </MemoryRouter>
        </Provider>
      // </AuthProvider>
        );
    const userListLink = screen.getByText(/SDM/i);
    expect(userListLink).toBeInTheDocument();
  
  });
})