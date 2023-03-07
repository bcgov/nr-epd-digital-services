import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from './app/Store'
import { saveToLocalStorage } from './app/helpers/sessionManager';

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))
saveToLocalStorage as jest.Mock



it('renders log in panel', () => {
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: false}
  )
  render(
    //<AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    //</AuthProvider>
      );
  const loginPanel = screen.getByText(/Log In to my LRS Account/i);
  expect(loginPanel).toBeInTheDocument();

});

test('Renders LRS Form Accordion', () =>{
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
  const formAccordion = screen.getByText(/This is the first sample lrs form, please use this for lrs things/i)
  expect(formAccordion).toBeInTheDocument()
})

