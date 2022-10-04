import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import {store} from './app/Store'

it('renders user list', () => {
  render(    
    <Provider store={store}>
      <App />
    </Provider>  );
  const userlist = screen.getByText(/Users/i);
  expect(userlist).toBeInTheDocument();

});

test('renders add new user form', () =>{
  render(    
    <Provider store={store}>
      <App />
    </Provider>  );
  const userform = screen.getByText(/Add new User/i)
  expect(userform).toBeInTheDocument()
})

