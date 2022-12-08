import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "react-oidc-context";
import { useForm } from "react-hook-form";

import "./UserProfile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLookupData,
  getProfileFetchStatus,
  getRegions,
  getOrganizations
} from "../common/CommonDataSlice";
import { addNewExternalUser, getUserAddedStatus,getExternalUser, updateExternalUser } from "./UsersSlice";
import { AppDispatch } from "../../Store";
import { ExternalUser } from "./dto/ExternalUser";
import { RequestStatus } from "../../helpers/requests/status";
import { useNavigate } from "react-router-dom";

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

  const savedExternalUser = useSelector(getExternalUser);

  const [selectedRegionId, setSelectedRegionId] = useState('');

 useEffect(()=>{
  setSelectedRegionId(savedExternalUser.regionId)
 },[savedExternalUser])


  const handleRegionSelectChange = (event:any) => {
    setSelectedRegionId(event.target.value)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExternalUser>({
    defaultValues : savedExternalUser
  });

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

    if(savedExternalUser!=null && savedExternalUser.id !== undefined  && savedExternalUser.id !== '' )
    {
      // update user profile 
      console.log("update user profile",data);

      delete data['isBillingContactST'];

      dispatch(updateExternalUser(data))
    }
    else
    {
      dispatch(addNewExternalUser(data));
    }

 
  });
  const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const regions = useSelector(getRegions);
  const regionSelector = regions.map((_region:any)=>{
    if(_region.id)
    return <option key={_region.id} value={_region.id}>{_region.region_name}</option>
  })

  const organizationTypes = useSelector(getOrganizations)
  const lookupDataFetchStatus = useSelector(getProfileFetchStatus);



  const navigate = useNavigate();

  useEffect(() => {
    console.log("dispatching fetchLookupData");
    dispatch(fetchLookupData());
    console.log("current profile status", lookupDataFetchStatus);
  }, []);

  useEffect(() => {
    console.log(organizationTypes)
  },[organizationTypes])

  useEffect(() => {
    console.log("regions", regions);
  }, [regions]);

  useEffect(() => {
    if (addedStatus === RequestStatus.success) {
      console.log("user added ");
      navigate("/dashboard");
    }

    console.log("user add status ", addedStatus);
  }, [addedStatus]);


  const getPropertyValue = ( propertyName:string) =>{
    if(savedExternalUser!=null)
    {
      return savedExternalUser[propertyName];
    }
  }

  const isSelected = ( propertyName:string, boxValue:string) =>{
    if(savedExternalUser!=null)
    {
      let savedValue = savedExternalUser[propertyName];      
      return savedValue===boxValue;
    }
  }

  return (
    <Container fluid className="g-4 pt-5 mt-4">
      {/* <p>{regions}</p> */}
      <Row>
        <Col className="mx-md-5">
          <Form onSubmit={onSubmit}>
            <Row className="pt-4">
              <Col id="form-header" className="my-1">
                <h5>Section 1 - Profile Information</h5>
              </Col>
            </Row>
            <Row>
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
                  // value={getPropertyValue("firstName")}
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
                  autoComplete=""
                  // value={getPropertyValue("lastName")}
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
                  id="geocodeField"
                  {...register("addressLine")}
                  type="text"
                  aria-placeholder="Street Address"
                  placeholder="Street Address"
                  required
                  // value={getPropertyValue("addressLine")}
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
                  // value={getPropertyValue("city")}
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
                  // value={getPropertyValue("province")}
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
                  // value={getPropertyValue("country")}
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
                  // value={getPropertyValue("postalCode")}
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
                  // value={getPropertyValue("phoneNumber")}
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
                  // value={getPropertyValue("email")}
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
                  aria-label="Choose Region"
                  required
                  value={selectedRegionId}
                  onChange={(e)=>{handleRegionSelectChange(e)}}
                  // value={getPropertyValue("regionId")}
                >
                  {regionSelector}
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-4"
                controlId="formIndustry"
              >
                <Form.Label>Industry</Form.Label>
                <Form.Control
                  required
                  {...register("industry")}
                  type="text"
                  placeholder="Industry"
                  aria-placeholder="Industry"
                  // value={getPropertyValue("industry")}
                />
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-4"
                controlId="formOrganization"
              >
                <Form.Label>Organization</Form.Label>
                <Form.Control
                  required
                  {...register("organization")}
                  type="text"
                  placeholder="Organization"
                  aria-placeholder="Organization"
                  // value={getPropertyValue("organization")}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-2">
                <Form.Label>Are you a CSAP or QP or Public user ?</Form.Label>
                <Form.Check
                  required
                  value="csap"
                  type="radio"
                  label="CSAP"
                  {...register("userWorkStatus")}  
                  // checked = {isSelected("userWorkStatus","csap")}               
                />
                <Form.Check
                  required
                  value="qp"
                  type="radio"
                  label="QP"
                  {...register("userWorkStatus")}
                  // checked = {isSelected("userWorkStatus","qp")}   
                />
                <Form.Check
                  required
                  value="public"
                  type="radio"
                  label="Public"
                  {...register("userWorkStatus")}
                  // checked = {isSelected("userWorkStatus","public")}   
                />
              </Form.Group>
            </Row>
            <Row>
              <div key="radio" className="mb-3">
                <Form.Label>
                  Are you representing one of the following?
                </Form.Label>
                {organizationTypes.map((type:any)=>{
                  return (
                  <Form.Check key={type.id}
                  required
                  {...register("organizationTypeId")}
                  name="organizationTypeId"
                  value={type.id}
                  type="radio"
                  label={type.org_name} 
                  // checked = {isSelected("organizationTypeId",type.id)}
                />)
                })}
              </div>
            </Row>
            <Row>
              <div key="radio" className="mb-3">
                <Form.Label>Do you identify as the following?</Form.Label>
                <Form.Check
                  required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="FN"
                  type="radio"
                  label="First Nations"
                  // checked = {isSelected("userFNStatus","FN")}
                />
                <Form.Check
                  required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="IN"
                  type="radio"
                  label="Inuit"
                  // checked = {isSelected("userFNStatus","IN")}
                />
                <Form.Check
                  required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="MT"
                  type="radio"
                  label="Metis"
                  // checked = {isSelected("userFNStatus","MT")}
                />
                <Form.Check
                  required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="NO"
                  type="radio"
                  label="None"
                  // checked = {isSelected("userFNStatus","NO")}
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
                <Form.Label>Is Billing contact info the same?</Form.Label>
                <Form.Check
                  required
                  value="true"
                  {...register("isBillingContactST")}
                  name="isBillingContactST"
                  type="radio"
                  label="Yes"
                  // checked = {isSelected("isBillingContact","true")}
                />
                <Form.Check
                  required
                  value="false"
                  {...register("isBillingContactST")}
                  name="isBillingContactST"
                  type="radio"
                  label="No"
                  // checked = {isSelected("isBillingContact","false")}
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
                { savedExternalUser && <Button id="back-profile-btn" onClick={()=>{navigate("/dashboard")}}>Back</Button>}
                <Button id="save-profile-btn" type="submit">Save Profile</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
