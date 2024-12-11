import { store } from '../../app/Store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ReactComponentElement, ReactHTMLElement } from 'react';

const TestWrapper = ({ children }: any) => {
  return (
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  );
};

export default TestWrapper;
