import { UserProfile } from "./UserProfile";
import {render,screen} from "@testing-library/react"
import TestWrapper from "../../../../utilities/test/TestUtils";
import { useAuth } from "react-oidc-context";
import userEvent from "@testing-library/user-event";

jest.mock('react-oidc-context', () =>({
    useAuth: jest.fn()
}))

const authMocked = (useAuth as jest.Mock)

const testUser = {profile: {
    given_name: "Test Given Name",
    family_name: "Test Family Name",
    email: "test@email.test"
}}

const newExternalUserSetup =() =>{
    authMocked.mockReturnValue(
        {
            isAuthenticated:true,
            user: testUser
        })
    render(
        <TestWrapper>
            <UserProfile/>
        </TestWrapper>
    )
}  

test('Renders user profile page', async () =>{
    newExternalUserSetup()
    const profileInformationHeader = screen.getByText(/Profile Information/i)
    expect(profileInformationHeader).toBeInTheDocument()
})

test('Renders profile page for new user correctly', async () =>{
    newExternalUserSetup();
    expect(screen.getByRole('form', {name:""}))
    .toHaveFormValues({
        firstName: testUser.profile.given_name,
        lastName: testUser.profile.family_name,
        email: testUser.profile.email
    })
})

test('Prevents submission with incomplete entries',async () => {
    newExternalUserSetup()
    const saveButton = screen.getByText(/Save Profile/i)
    userEvent.click(saveButton)
    expect(screen.getByPlaceholderText(/City/i)).toBeInvalid()
})