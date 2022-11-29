
import { IdTokenClaims } from "oidc-client-ts"
import { useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useAuth } from "react-oidc-context"



export const UserProfile = () =>{

	const [userProfile, setUserProfile] = useState<IdTokenClaims | null>()
	const [isReadOnly, setReadOnly] = useState(false)

    const auth = useAuth()
	if(!auth.isLoading){
		//setUserProfile(auth.user?.profile)
	}
    
	//const isReadOnly = true;
    if (userProfile?.identity_provider === "idir"){
        setReadOnly(true);
    }
	
    return (
        <Container fluid className="g-5">
			<Button 
				variant={isReadOnly ? "success" : "danger" } 
				onClick={() => { 
						console.log(isReadOnly)
						setReadOnly(!isReadOnly)
					}}>
					Edit Profile</Button>
				<Row>
					<Col className="mx-md-3" >
						<Form className={isReadOnly ? "bg bg-secondary" : ""}>
							<Row>
								<Col className="bg bg-secondary float">
									<h3>Section 1 - Profile Information</h3>
								</Col>
							</Row>
							<Row className="w-100">
								<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formFirstName">
									<Form.Label>Name</Form.Label>
									<Form.Control readOnly={isReadOnly} type="text" aria-placeholder="Add name here" placeholder="Add name here"/>
								</Form.Group>
								<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formFamilyName">
									<Form.Label>Family Name</Form.Label>
									<Form.Control readOnly={isReadOnly} type="text" aria-placeholder="Add Family Name here" placeholder="Add Family Name Here"/>
								</Form.Group>
							</Row>
							<Row>
								<Form.Group className="mb-2 col-xs-12 col-sm-12" controlId="formOrganization">
									<Form.Label>Organization, if applicable</Form.Label>
									<Form.Control readOnly={isReadOnly}  type="text" aria-placeholder="Organization" placeholder="Organization"/>
								</Form.Group>
							</Row>
							<Row>
								<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formStreetAddress">
									<Form.Label>Street Address</Form.Label>
									<Form.Control readOnly={isReadOnly} type="text" aria-placeholder="Street Address" placeholder="Street Address"/>
								</Form.Group>
								<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formCity">
									<Form.Label>City</Form.Label>
									<Form.Control readOnly={isReadOnly} type="text" aria-placeholder="City" placeholder="City"/>
								</Form.Group>
							</Row>
							<Row>
								<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formProvince">
									<Form.Label>Province</Form.Label>
									<Form.Control readOnly={isReadOnly} type="text" aria-placeholder="Province" placeholder="Province"/>
								</Form.Group>
								<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formCountry">
									<Form.Label>Country</Form.Label>
									<Form.Control readOnly={isReadOnly} type="text" aria-placeholder="Country" placeholder="Country"/>
								</Form.Group>
								<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formPostalCode">
									<Form.Label>Postal Code</Form.Label>
									<Form.Control readOnly={isReadOnly} type="text" aria-placeholder="Postal Code" placeholder="Postal Code"/>
								</Form.Group>
							</Row>
							<Row>
								<Form.Group className="mb-2 col-xs-12 col-sm-6">
									<Form.Label>Phone Number</Form.Label>
									<Form.Control readOnly={isReadOnly}/>
								</Form.Group>
								<Form.Group className="mb-2 col-xs-12 col-sm-6">
									<Form.Label>Email</Form.Label>
									<Form.Control readOnly={isReadOnly} type="email" placeholder="Email" aria-placeholder="Email"/>
								</Form.Group>
							</Row>
						</Form>	
					</Col>
					
				</Row>					
                
        </Container>
    )
}