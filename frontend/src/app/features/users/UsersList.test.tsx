import UsersList from "./UsersList"; 
import { render, screen } from "@testing-library/react";
import TestWrapper from "../../../utilities/test/TestUtils";
import { saveToLocalStorage } from "../../helpers/sessionManager";


const wrapper = <TestWrapper><UsersList/></TestWrapper>

saveToLocalStorage as jest.Mock


test('Renders userslist with appropriate redux connections', async () =>{
    render(wrapper)
    expect(screen.getByText(/Users/i)).toBeInTheDocument()
})


