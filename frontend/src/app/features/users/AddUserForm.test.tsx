
import { fireEvent, render, screen} from "@testing-library/react";
import AddUserForm from './AddUserForm';
import TestWrapper from '../../../utilities/test/TestUtils';
import { saveToLocalStorage } from "../../helpers/sessionManager";

const wrapper = <TestWrapper><AddUserForm></AddUserForm></TestWrapper>

saveToLocalStorage as jest.Mock


const setup = () => {
    const utils = render(wrapper)
    const userNameInput = screen.getByLabelText("User Name:")
    const saveButton = screen.getByText("Save User")
    return {userNameInput, saveButton,utils}
}


test('Form Submits Correctly', () =>{
    const testUsername = new Date().getTime()
    const { userNameInput, saveButton,utils} = setup();
    fireEvent.change(userNameInput, {target: {value: testUsername}})
    fireEvent.click(saveButton)
    expect(userNameInput).toBeEmptyDOMElement()
})