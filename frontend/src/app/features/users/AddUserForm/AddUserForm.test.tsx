
import { fireEvent, render} from "@testing-library/react";
import AddUserForm from  '../AddUserForm'
import TestWrapper from '../../../../utilities/test/TestUtils';
import { store } from "../../../Store";
const wrapper = <TestWrapper><AddUserForm></AddUserForm></TestWrapper>

const setup = () => {
    const utils = render(wrapper)
    const userNameInput = utils.getByLabelText("User Name:")
    const saveButton = utils.getByText("Save User")
    return {userNameInput, saveButton,utils}
}


test('Form Submits Correctly', () =>{
    const testUsername = ''
    const { userNameInput, saveButton,utils} = setup();
    fireEvent.change(userNameInput, {target: {value: testUsername}})
    fireEvent.click(saveButton)
    expect(userNameInput).toBeEmptyDOMElement()
})