import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import {useAuth} from "react-oidc-context";
import {store} from './app/Store'

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))

test('Renders Intro', () =>{
  (useAuth as jest.Mock).mockReturnValue(
    {isAuthenticated: false}
  )
  render(    
      <Provider store={store}>
        <App />
      </Provider>
    );
  const formAccordion = screen.getByText(/Search Site Registry/i)
  expect(formAccordion).toBeInTheDocument()
})

