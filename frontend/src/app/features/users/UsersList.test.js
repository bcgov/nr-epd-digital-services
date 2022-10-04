import UsersList from "./UsersList"; 
import {Provider} from 'react-redux'
import  {store}  from "../../Store";
import { render, screen } from "@testing-library/react";
import {
    BrowserRouter as Router
  } from "react-router-dom";

//import { renderWithProviders } from "../../../utilities/test/TestUtils";

test.todo("Need to write wrapper which injects arbitrary test state and provider")

const wrapper = <Provider store={store}><Router><UsersList/></Router></Provider>



test('Renders userslist with appropriate redux connections', async () =>{
    render(wrapper)
    expect(screen.getByText(/Users/i)).toBeInTheDocument()
})


