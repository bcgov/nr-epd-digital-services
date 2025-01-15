import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LanguageSwitcher from './LanguageSwitcher';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
describe('Language Switcher Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      LanguageSwitcher: {},
    });
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        {' '}
        <LanguageSwitcher />
      </Provider>,
    );
    const languageSelector = screen.getByLabelText('Language Selector');
    expect(languageSelector).toBeInTheDocument();
  });

  it('displays the correct current language', () => {
    render(
      <Provider store={store}>
        {' '}
        <LanguageSwitcher />
      </Provider>,
    );
    const currentLanguageElement = screen.getByLabelText('Language Menu');
    expect(currentLanguageElement.textContent).toBe('EN'); // Assuming 'en' is the default language
  });

  it('changes the language when an option is selected', () => {
    render(
      <Provider store={store}>
        {' '}
        <LanguageSwitcher />
      </Provider>,
    );
    const dropdownToggleButton = screen.getByLabelText('Language Menu');
    fireEvent.click(dropdownToggleButton);
    const spanishOption = screen.getByLabelText('Español (Spanish)');
    fireEvent.click(spanishOption);
    const currentLanguageElement = screen.getByLabelText('Language Menu');
    expect(currentLanguageElement.textContent).toBe('ES');
  });

  it('toggles the dropdown menu when the toggle button is clicked', () => {
    render(
      <Provider store={store}>
        {' '}
        <LanguageSwitcher />
      </Provider>,
    );
    const dropdownToggleButton = screen.getByLabelText('Language Menu');
    fireEvent.click(dropdownToggleButton); // Open dropdown
    let dropdownMenu = screen.queryByRole('menu');
    expect(dropdownMenu).toBeInTheDocument();
    fireEvent.click(dropdownToggleButton); // Close dropdown
    dropdownMenu = screen.queryByRole('menu');
    expect(dropdownMenu).not.toBeInTheDocument();
  });
});
