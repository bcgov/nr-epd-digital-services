import UsersList from "./UsersList"; 
import {Provider} from 'react-redux'
import  {store}  from "../../Store";
import { render, screen } from "@testing-library/react";


//import { renderWithProviders } from "../../../utilities/test/TestUtils";

test.todo("Need to write wrapper which injects arbitrary test state and provider")

const wrapper = <Provider store={store}><UsersList/></Provider>



test('Renders userslist with appropriate redux connections', async () =>{
    render(wrapper)
    expect(screen.getByText(/Users/i)).toBeInTheDocument()
})


