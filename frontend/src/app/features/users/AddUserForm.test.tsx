
import { fireEvent, render, screen} from "@testing-library/react";
import AddUserForm from './AddUserForm';
import TestWrapper from '../../../utilities/test/TestUtils';
import { useDispatch } from "react-redux";
import { fetchUsers } from "./UsersSlice";
import { store } from "../../Store";
const wrapper = <TestWrapper><AddUserForm></AddUserForm></TestWrapper>

const setup = () => {
    const utils = render(wrapper)
    const userNameInput = utils.getByLabelText("User Name:")
    // const emailInput = utils.getByLabelText('Email:')
    const saveButton = utils.getByText("Save User")
    return {userNameInput, saveButton,utils}
}


test('Form Submits Correctly', () =>{
    const testUsername = new Date().getTime()
    const { userNameInput, saveButton,utils} = setup();
    // fireEvent.change(emailInput, {target: {value: "testemail@test.com"}})
    fireEvent.change(userNameInput, {target: {value: testUsername}})
    fireEvent.click(saveButton)
    // expect(emailInput).toBeEmpty()
    expect(userNameInput).toBeEmpty()
    console.log(store)
})