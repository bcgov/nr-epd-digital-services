import UsersList from "./UsersList"; 
import { render, screen } from "@testing-library/react";
import TestWrapper from "../../../utilities/test/TestUtils";


const wrapper = <TestWrapper><UsersList/></TestWrapper>



test('Renders userslist with appropriate redux connections', async () =>{
    render(wrapper)
    expect(screen.getByText(/Users/i)).toBeInTheDocument()
})


