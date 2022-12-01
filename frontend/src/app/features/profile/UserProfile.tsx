import { useEffect } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useAuth } from "react-oidc-context"
import {useForm} from 'react-hook-form'

import "./UserProfile.css"


type FormData = {
	firstName:string;
	lastName:string;
	organization:string;
	streetAddress:string;
	city: string;
	province: string;
	country: string;
	postalCode:string;
	phoneNumber:number;
	email:string;
	region:string;
	industry:string;
	csapOrQp: boolean;
	representing:string;
	fnStatus:string;
}


export const UserProfile = () =>{
	const {register, watch, handleSubmit, formState:{errors}} = useForm<FormData>();
	const onSubmit = handleSubmit(data => console.log(data))
    const auth = useAuth()

	useEffect( () =>{
		const subscription = watch((value,{name,type}) => {
			console.log(value,name,type)
		})
		return () => subscription.unsubscribe();
	},[watch])
	handleSubmit( (data) => {
		console.log(data)
	})
	
    return (
        <Container fluid className="g-4 pt-5 mt-4">
			<Row>
				<Col className="mx-md-5" >
					<Form onSubmit={onSubmit}>
						<Row className="pt-4">
							<Col id="form-header" className="my-1">
								<h5>Section 1 - Profile Information</h5>
							</Col>
						</Row>
						<Row className="w-100">
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formFirstName">
								<Form.Label>First Name</Form.Label>
								<Form.Control {...register("firstName")} type="text" aria-placeholder="First Name" placeholder="First Name"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formFamilyName">
								<Form.Label>Last Name</Form.Label>
								<Form.Control {...register("lastName")} type="text" aria-placeholder="Last Name" placeholder="Add Family Name Here"/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-sm-12" controlId="formOrganization">
								<Form.Label>Organization, if applicable</Form.Label>
								<Form.Control {...register("organization")} type="text" aria-placeholder="Organization" placeholder="Organization"/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formStreetAddress">
								<Form.Label>Street Address</Form.Label>
								<Form.Control {...register("streetAddress")} type="text" aria-placeholder="Street Address" placeholder="Street Address"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formCity">
								<Form.Label>City</Form.Label>
								<Form.Control {...register("city")} type="text" aria-placeholder="City" placeholder="City"/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formProvince">
								<Form.Label>Province</Form.Label>
								<Form.Control  {...register("province")} type="text" aria-placeholder="Province" placeholder="Province"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formCountry">
								<Form.Label>Country</Form.Label>
								<Form.Control {...register("country")} type="text" aria-placeholder="Country" placeholder="Country"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formPostalCode">
								<Form.Label>Postal Code</Form.Label>
								<Form.Control {...register("postalCode")} type="text" aria-placeholder="Postal Code" placeholder="Postal Code"/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formPhoneNumber">
								<Form.Label>Phone Number</Form.Label>
								<Form.Control {...register("phoneNumber")} type="text" placeholder="Phone Number" aria-placeholder="Phone Number"  />
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control {...register("email")}  type="email" placeholder="Email" aria-placeholder="Email"/>
							</Form.Group>
						</Row>
						<Row className="pt-4">
							<Col id="form-header" className="my-1">
								<h5>Section 2 - Additional Information</h5>
							</Col>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formRegion">
								<Form.Label>Region</Form.Label>
								<Form.Select {...register("region")} aria-label="Choose Region">
									<option value="Alberni–Clayoquot">Alberni–Clayoquot</option>
									<option value="Capital">Capital</option>
									<option value="Cariboo">Cariboo</option>
									<option value="Central Coast">Central Coast</option>
									<option value="Central Kootenay">Central Kootenay</option>
									<option value="Central Okanagan">Central Okanagan</option>
									<option value="Columbia-Shuswap">Columbia-Shuswap</option>
									<option value="Comox Valley">Comox Valley</option>
									<option value="Cowichan Valley">Cowichan Valley</option>
									<option value="East Kootenay">East Kootenay</option>
									<option value="Fraser Valley">Fraser Valley</option>
									<option value="Fraser-Fort George">Fraser-Fort George</option>
									<option value="Kitimat-Stikine">Kitimat-Stikine</option>
									<option value="Kootenay Boundary">Kootenay Boundary</option>
									<option value="Metro Vancouver">Metro Vancouver</option>
									<option value="Mount Waddington">Mount Waddington</option>
									<option value="Nanaimo">Nanaimo</option>
									<option value="Nechako">Nechako</option>
									<option value="North Coast">North Coast</option>
									<option value="North Okanagan">North Okanagan</option>
									<option value="Northern Rockies">Northern Rockies</option>
									<option value="Okanagan-Similkameen">Okanagan-Similkameen</option>
									<option value="Peace River">Peace River</option>
									<option value="qathet">qathet</option>
									<option value="Squamish-Lillooet">Squamish-Lillooet</option>
									<option value="Stikine Region">Stikine Region</option>
									<option value="Strathcona">Strathcona</option>
									<option value="Sunshine Coast">Sunshine Coast</option>
									<option value="Thompson Nicola">Thompson Nicola</option>
								</Form.Select>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formIndustry">
								<Form.Label>Industry</Form.Label>
								<Form.Control {...register("industry")} type="text" placeholder="Industry" aria-placeholder="Industry"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formOrganization">
								<Form.Label>Organization</Form.Label>
								<Form.Control {...register("organization")} type="text" placeholder="Organization" aria-placeholder="Organization"/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-2">
								<Form.Label>Are you a CSAP or QP?</Form.Label>
								<Form.Check value="true" type="radio" label="Yes" {...register("csapOrQp")}/>
								<Form.Check value="false" type="radio" label="No" {...register("csapOrQp")}/>
							</Form.Group>
								
						</Row>
						<Row>
							<div key="radio" className="mb-3">
								<Form.Label>Are you representing one of the following?</Form.Label>
								<Form.Check {...register("representing")} name="representing" type="radio" label="Financial Institution"/>
								<Form.Check {...register("representing")} name="representing" type="radio" label="Real Estate Organization"/>
								<Form.Check {...register("representing")} name="representing" type="radio" label="Municipality"/>
								<Form.Check {...register("representing")} name="representing" type="radio" label="None"/>
							</div>
						</Row>
						<Row>
							<div key="radio" className="mb-3">
								<Form.Label>Do you identify as the following?</Form.Label>
								<Form.Check {...register("fnStatus")} name="fnStatus" type="radio" label="First Nations"/>
								<Form.Check {...register("fnStatus")} name="fnStatus" type="radio" label="Inuit"/>
								<Form.Check {...register("fnStatus")} name="fnStatus" type="radio" label="Metis"/>
								<Form.Check {...register("fnStatus")} name="fnStatus" type="radio" label="None"/>
							</div>
						</Row>

						<Row className="pt-4">
							<Col id="form-header" className="my-1">
								<h5>Section 3 - Billing Details</h5>
							</Col>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formBillingAddress">
								<Form.Label>Billing Address</Form.Label>
								<Form.Control type="text" aria-placeholder="Billing Address" placeholder="Billing Address"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formBillingCity">
								<Form.Label>City</Form.Label>
								<Form.Control type="text" aria-placeholder="City" placeholder="City"/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formBillingProvince">
								<Form.Label>Province</Form.Label>
								<Form.Control  type="text" aria-placeholder="Province" placeholder="Province"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formBillingCountry">
								<Form.Label>Country</Form.Label>
								<Form.Control type="text" aria-placeholder="Country" placeholder="Country"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-sm-4" controlId="formBillingPostalCode">
								<Form.Label>Postal Code</Form.Label>
								<Form.Control type="text" aria-placeholder="Postal Code" placeholder="Postal Code"/>
							</Form.Group>
						</Row>
						<Row className="w-100">
							<Form.Group className="mb-2 col-sm-6" controlId="formBillingName">
								<Form.Label>Name on Card</Form.Label>
								<Form.Control type="text" aria-placeholder="Add name here" placeholder="Add name here"/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-6">
								<Form.Label>Card Number</Form.Label>
								<Form.Control type="text" aria-placeholder="Card Number" placeholder="Card Number"/>
							</Form.Group>
						</Row>
						<Row>
							<Form.Group className="mb-2 col-xs-12 col-3">
								<Form.Label>Expiration</Form.Label>
								<Form.Control type="text" aria-placeholder="Expiry Date" placeholder="MM/YY"/>
							</Form.Group>
							<Form.Group className="mb-2 col-xs-12 col-3">
								<Form.Label>CVV</Form.Label>
								<Form.Control type="text" aria-placeholder="CVV" placeholder="CVV"/>
							</Form.Group>
						</Row>
						<Row >
							<Col className="text-end mb-3">
								<Button type="submit">Save Profile</Button>
							</Col>
						</Row>
					</Form>	
				</Col>
			</Row>					
        </Container>
    )
}