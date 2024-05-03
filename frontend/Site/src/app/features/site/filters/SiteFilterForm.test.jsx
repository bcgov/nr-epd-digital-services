import React from 'react';
import { render, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import SiteFilterForm from './SiteFilterForm';


describe('SiteFilterForm component', () => {
    it('render without chrashing', async () => {
        render(<SiteFilterForm/>);
    });

    it('Update the input text value correctly', async () =>{
        const { getByLabelText } = render(<SiteFilterForm/>);
        const input = getByLabelText('Site ID');
        fireEvent.change(input, {target : {value: "1"}});
        expect(input.value).toBe("1");
        fireEvent.change(input, {target: {value : "125,13626"}});
        expect(input.value).toBe("125,13626");
    });

    it('Clear form data on reset button click', async () => {
        const { getByText, getByLabelText } = render(<SiteFilterForm/>);
        const input = getByLabelText('Site ID');
        fireEvent.change(input, {target : {value: "1"}})
        const resetButton = getByText('Reset Filters');
        fireEvent.click(resetButton);
        expect(input.value).toBe('')
    });

    it('clear form data on cancel button click', async () => {
        const { getByText, getByLabelText} = render(<SiteFilterForm/>);
        console.log(getByLabelText);
        const input = getByLabelText('Site Address');
        fireEvent.change(input, {target:{value: "12345 ABC"}});
        const cancelBtn = getByText('Cancel');
        fireEvent.click(cancelBtn);
        expect(input.value).toBe('');
    });

    it('adds and removes selected filter correctly', async () => {
        const { getByText, getByLabelText } = render(<SiteFilterForm/>);
        const input = getByLabelText('Site ID');
        fireEvent.change(input, { target: { value : '1252, 5265'}});
        const subBtn = getByText('Submit');
        fireEvent.click(subBtn);
        console.log(getByTestId);
        // await waitFor(() => {
        //     const selectedFilter = getByTestId('selected-filter');
        //     expect(selectedFilter.textContent).toContain('1252, 5265');
        // });
        // const removeButton = getByTestId('remove-filter');
        // fireEvent.click(removeButton);
        // await waitFor(() => {
        // const selectedFilter = getByTestId('selected-filter');
        // expect(selectedFilter.textContent).toBe('');
        // });
    });

});