import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from './app/Store'

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))



it('renders log in panel', () => {
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: false}
  )
  render(
      <Provider store={store}>
        <App />
      </Provider>
      );
  const loginPanel = screen.getByText(/Login/i);
  expect(loginPanel).toBeInTheDocument();

});

test('Renders LRS Form Accordion', () =>{
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: true}
  )
  render(    
      <Provider store={store}>
        <App />
      </Provider>
    );
  const formAccordion = screen.getByText(/Welcome./i)
  expect(formAccordion).toBeInTheDocument()
})

