import { render, fireEvent } from '@testing-library/react';
import SiteFilterForm from './SiteFilterForm';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('SiteFilterForm component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
        sites: {},
        });
    });

    it('render without chrashing', async () => {
        render(
            <Provider store={store}>
                <SiteFilterForm  cancelSearchFilter={() => {}}/>
            </Provider>);
    });

    it('Update the input text value correctly', async () =>{
        const { getByLabelText } = render( <Provider store={store}>
            <SiteFilterForm  cancelSearchFilter={() => {}}/>
        </Provider>);
        const input = getByLabelText('Site ID');
        fireEvent.change(input, {target : {value: "1"}});
        expect(input.value).toBe("1");
        fireEvent.change(input, {target: {value : "125,13626"}});
        expect(input.value).toBe("125,13626");
    });

    it('Clear form data on reset button click', async () => {
        const { getByText, getByLabelText } = render( <Provider store={store}>
            <SiteFilterForm  cancelSearchFilter={() => {}}/>
        </Provider>);
        const input = getByLabelText('Site ID');
        fireEvent.change(input, {target : {value: "1"}})
        const resetButton = getByText('Reset Filters');
        fireEvent.click(resetButton);
        expect(input.value).toBe('')
    });

    it('clear form data on cancel button click', async () => {
        const { getByText, getByLabelText} = render( <Provider store={store}>
            <SiteFilterForm  cancelSearchFilter={() => {}}/>
        </Provider>);
        const input = getByLabelText('Site Address');
        fireEvent.change(input, {target:{value: "12345 ABC"}});
        const cancelBtn = getByText('Cancel');
        fireEvent.click(cancelBtn);
        expect(input.value).toBe('');
    });

    it('renders Dropdown component correctly', () => {
        const { getByLabelText, getByPlaceholderText } = render(
            <Provider store={store}>
                <SiteFilterForm  cancelSearchFilter={() => {}}/>
            </Provider>
        );
        const dropdownLabel = getByLabelText('City');
        const dropdownPlaceholder = getByPlaceholderText('Select City');
        expect(dropdownLabel).toBeInTheDocument();
        expect(dropdownPlaceholder).toBeInTheDocument();
      });
});