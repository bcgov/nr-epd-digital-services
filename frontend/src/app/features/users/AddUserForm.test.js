import {Provider} from 'react-redux'
import  {store}  from "../../Store";
import { fireEvent, render, screen } from "@testing-library/react";
import AddUserForm from './AddUserForm';

const wrapper = <Provider store={store}><AddUserForm></AddUserForm></Provider>

const setup = () => {
    const utils = render(wrapper)
    const userNameInput = utils.getByLabelText("User Name:")
    const emailInput = utils.getByLabelText('Email:')
    const saveButton = utils.getByText("Save User")
    return {emailInput,userNameInput, saveButton}
}


test('submit new user', () =>{
    const {emailInput, userNameInput, saveButton} = setup();
    fireEvent.change(emailInput, {target: {value: "testemail@test.com"}})
    fireEvent.change(userNameInput, {target: {value: "test1"}})
    fireEvent.click(saveButton)
    expect(emailInput).toBeEmpty()
    expect(userNameInput).toBeEmpty()
})