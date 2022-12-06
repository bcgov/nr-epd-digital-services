import { useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "react-oidc-context";
import { useForm } from "react-hook-form";

import "./UserProfile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRegions,
  getProfileFetchStatus,
  getRegions,
} from "./ProfileSlice";
import { addNewExternalUser, getUserAddedStatus } from "../users/UsersSlice";
import { AppDispatch } from "../../Store";
import { ExternalUser } from "../users/dto/ExternalUser";
import { RequestStatus } from "../../helpers/requests/status";
import { useNavigate } from "react-router-dom";
import { Region } from "./dto/Profile";

// type FormData = {
// 	userId:string | undefined;
// 	firstName:string;
// 	lastName:string;
// 	organization:string;
// 	addressLine:string;
// 	city: string;
// 	province: string;
// 	country: string;
// 	postalCode:string;
// 	phoneNumber:number;
// 	email:string;
// 	regionId:string;
// 	industry:string;
// 	userWorkStatus: boolean;
// 	organizationTypeId:string;
// 	userFNStatus:string;
// 	isBillingContact:boolean;
// 	isProfileVerified:boolean
// }

//TODO: Update dropdown for region to match api, update organization type for api

export const UserProfile = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ExternalUser>();

  const addedStatus = useSelector(getUserAddedStatus);

  const onSubmit = handleSubmit((data: ExternalUser) => {
    data.userId = auth.user?.profile.sub;
    data.isProfileVerified = true;
    console.log("data", data);
    if (data.isBillingContactST === "true") {
      data.isBillingContact = true;
    } else {
      data.isBillingContact = false;
    }
    data.isGstExempt = false;
    dispatch(addNewExternalUser(data));
  });
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const regions = useSelector(getRegions);
  const profileFetchStatus = useSelector(getProfileFetchStatus);

  const navigate = useNavigate();

  useEffect(() => {
	console.log("dispatching fetchRegions")
    dispatch(fetchRegions());
	console.log("current profile status",profileFetchStatus)
  }, []);

  useEffect(() => {
	console.log("current profile status",profileFetchStatus)
    // if (profileFetchStatus === RequestStatus.success) {
    //   console.log(regions);
	//   const regionOptions = regions.data.map((x:any)=>{
	// 	 return <option value={x.id} >{x.region_name}</option>
	//   })
	//   console.log("regionOptions",regionOptions)
    // }
  }, [regions,profileFetchStatus]);

  useEffect(() => {
    if (addedStatus === RequestStatus.success) {
      console.log("user added ");
      	navigate("/dashboard");
    }

    console.log("user add status ", addedStatus);
  }, [addedStatus]);

  // useEffect( () =>{
  // 	const subscription = watch((value,{name,type}) => {
  // 		console.log(value,name,type)
  // 	})
  // 	return () => subscription.unsubscribe();
  // },[watch])

  return (
    <Container fluid className="g-4 pt-5 mt-4">
      <p>{regions}</p>
      <Row>
        <Col className="mx-md-5">
          <Form onSubmit={onSubmit}>
            <Row className="pt-4">
              <Col id="form-header" className="my-1">
                <h5>Section 1 - Profile Information</h5>
              </Col>
            </Row>
            <Row className="w-100">
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formFirstName"
              >
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  {...register("firstName")}
                  type="text"
                  aria-placeholder="First Name"
                  placeholder="First Name"
				  required
                />				
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formFamilyName"
              >
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  {...register("lastName")}
                  type="text"
                  aria-placeholder="Last Name"
                  placeholder="Add Family Name Here"
				  required
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formaddressLine"
              >
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  {...register("addressLine")}
                  type="text"
                  aria-placeholder="Street Address"
                  placeholder="Street Address"
				  required
                />
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formCity"
              >
                <Form.Label>City</Form.Label>
                <Form.Control
                  {...register("city")}
                  type="text"
                  aria-placeholder="City"
                  placeholder="City"
				  required
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-4"
                controlId="formProvince"
              >
                <Form.Label>Province</Form.Label>
                <Form.Control
                  {...register("province")}
                  type="text"
                  aria-placeholder="Province"
                  placeholder="Province"
				  required
                />
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-4"
                controlId="formCountry"
              >
                <Form.Label>Country</Form.Label>
                <Form.Control
                  {...register("country")}
                  type="text"
                  aria-placeholder="Country"
                  placeholder="Country"
				  required
                />
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-4"
                controlId="formPostalCode"
              >
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  {...register("postalCode")}
                  type="text"
                  aria-placeholder="Postal Code"
                  placeholder="Postal Code"
				  required
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formPhoneNumber"
              >
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  {...register("phoneNumber")}
                  type="text"
                  placeholder="Phone Number"
                  aria-placeholder="Phone Number"
				  required
                />
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formEmail"
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  aria-placeholder="Email"
				  required
                />
              </Form.Group>
            </Row>
            <Row className="pt-4">
              <Col id="form-header" className="my-1">
                <h5>Section 2 - Additional Information</h5>
              </Col>
            </Row>
            <Row>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-4"
                controlId="formRegion"
              >
                <Form.Label>Region</Form.Label>
                <Form.Select
                  {...register("regionId")}
                  aria-label="Choose Region"  required
                >
                  <option value="9f7df7e5-3af5-4aa8-be35-34180ff3e798">
                    Alberni–Clayoquot
                  </option>
                  {/* <option value="Capital">Capital</option>
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
									<option value="Thompson Nicola">Thompson Nicola</option> */}
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-4"
                controlId="formIndustry"
              >
                <Form.Label>Industry</Form.Label>
                <Form.Control required
                  {...register("industry")}
                  type="text"
                  placeholder="Industry"
                  aria-placeholder="Industry"
                />
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-4"
                controlId="formOrganization"
              >
                <Form.Label>Organization</Form.Label>
                <Form.Control required
                  {...register("organization")}
                  type="text"
                  placeholder="organization"
                  aria-placeholder="Organization"
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-2">
                <Form.Label>Are you a CSAP or QP or Public user ?</Form.Label>
                <Form.Check  required
                  value="csap"
                  type="radio"
                  label="CSAP"
                  {...register("userWorkStatus")}
                />
                <Form.Check required
                  value="qp"
                  type="radio"
                  label="QP"
                  {...register("userWorkStatus")}
                />
                <Form.Check required
                  value="public"
                  type="radio"
                  label="Public"
                  {...register("userWorkStatus")}
                />
              </Form.Group>
            </Row>
            <Row>
              <div key="radio" className="mb-3">
                <Form.Label>
                  Are you representing one of the following?
                </Form.Label>
                <Form.Check required
                  {...register("organizationTypeId")}
                  name="organizationTypeId"
                  value="3e724dbc-e0af-4a18-aa22-4ea666df9955"
                  type="radio"
                  label="Financial Institution"
                />
                <Form.Check required
                  {...register("organizationTypeId")}
                  name="organizationTypeId"
                  type="radio"
                  label="Real Estate Organization"
                />
                <Form.Check required
                  {...register("organizationTypeId")}
                  name="organizationTypeId"
                  type="radio"
                  label="Municipality"
                />
                <Form.Check required
                  {...register("organizationTypeId")}
                  name="organizationTypeId"
                  type="radio"
                  label="None"
                />
              </div>
            </Row>
            <Row>
              <div key="radio" className="mb-3">
                <Form.Label>Do you identify as the following?</Form.Label>
                <Form.Check required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="FN"
                  type="radio"
                  label="First Nations"
                />
                <Form.Check required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="IN"
                  type="radio"
                  label="Inuit"
                />
                <Form.Check required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="MT"
                  type="radio"
                  label="Metis"
                />
                <Form.Check required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="NO"
                  type="radio"
                  label="None"
                />
              </div>
            </Row>

            <Row className="pt-4">
              <Col id="form-header" className="my-1">
                <h5>Section 3 - Billing Details</h5>
              </Col>
            </Row>
            <Row>
              <div key="radio" className="mb-3">
                <Form.Label>Is Billing contact info same ?</Form.Label>
                <Form.Check required
                  value="true"
                  {...register("isBillingContactST")}
                  name="isBillingContactST"
                  type="radio"
                  label="Yes"
                />
                <Form.Check required
                  value="false"
                  {...register("isBillingContactST")}
                  name="isBillingContactST"
                  type="radio"
                  label="No"
                />
              </div>
            </Row>
            {/* <Row>
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
							<Form.Group className="mb-2 col-xs-12 col-sm-6" controlId="formBillingName">
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
						</Row> */}
            <Row>
              <Col className="text-end mb-3">
                <Button type="submit">Save Profile</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
