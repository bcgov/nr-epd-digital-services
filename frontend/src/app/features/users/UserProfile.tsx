import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "react-oidc-context";
import { useForm } from "react-hook-form";

import "./UserProfile.css";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchLookupData,
  getRegions,
  getOrganizations,
} from "../common/CommonDataSlice";
import {
  addNewExternalUser,
  getUserAddedStatus,
  getExternalUser,
  updateExternalUser,
  getUserUpdateStatus,
  fetchUserProfileVerification,
  resetAddedStatus,
  resetUpdateStatus,
  isProfileVerified
} from "./UsersSlice";
import { AppDispatch } from "../../Store";
import { ExternalUser } from "./dto/ExternalUser";
import { RequestStatus } from "../../helpers/requests/status";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserProfile = () => {
  //Hooks
  const userAuth = useAuth();

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  //redux state selectors
  const updateUserStatus = useSelector(getUserUpdateStatus);
  const savedExternalUser = useSelector(getExternalUser);
  const addedStatus = useSelector(getUserAddedStatus);
  const organizationTypes = useSelector(getOrganizations);
  const regions = useSelector(getRegions);
  const userIsProfileVerifiedValue = useSelector(isProfileVerified)

  //  page state management
  const [selectedRegionId, setSelectedRegionId] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    getFieldState,
    getValues,  
    clearErrors,
  } = useForm<ExternalUser>({
    shouldUseNativeValidation:true,
    defaultValues: savedExternalUser,
  });
  
  //Loads default values from authorized user
  useEffect(() => {
    if(!userIsProfileVerifiedValue && userAuth.user){
      setValue("firstName", (userAuth.user.profile.given_name as string) )
      setValue("lastName", (userAuth.user.profile.family_name as string))
      setValue("email", (userAuth.user.profile.email as string))
    }
    },[userIsProfileVerifiedValue]
  )  


  // Handles logic after update is done
  useEffect(() => {
    if (updateUserStatus === RequestStatus.success) {
      // toast("Profile updated successfully",{
      //   type: "success",
      // });
      dispatch(resetUpdateStatus(""));
      toast.success("Profile updated successfully");
      if (userAuth.user)
        dispatch(fetchUserProfileVerification(userAuth.user.profile.sub));
    } else if (updateUserStatus === RequestStatus.failed) {
      toast.error("Failed to update the profile. Please try again");
    }
  }, [updateUserStatus]);


  
   /** Handling Logic after Profile Add State */
   useEffect(() => {
    if (addedStatus === RequestStatus.success) {
      toast("Profile saved successfully", {
        type: "success",
      });
      dispatch(resetAddedStatus(""));
      navigate("/dashboard");
    } else if (addedStatus === RequestStatus.failed) {
      toast("Failed to save profile", {
        type: "error",
      });
    }
  }, [addedStatus]);

  // Handling setting regionId from Saved User
  useEffect(() => {
    if (savedExternalUser) {
      setSelectedRegionId(savedExternalUser.regionId);
    } else {
    }
  }, [savedExternalUser]);

  useEffect(() => {
    dispatch(fetchLookupData());
  }, []);

  // User Events

  const handleRegionSelectChange = (event: any) => {
    setSelectedRegionId(event.target.value);
  };

  const onSubmit = handleSubmit((data: ExternalUser) => {
    if (data.regionId == "") {
      toast.error("Please select region id");
      return;
    }

    data.userId = userAuth.user?.profile.sub;
    data.isProfileVerified = true;

    if (data.isBillingContactST === "true") {
      data.isBillingContact = true;
    } else {
      data.isBillingContact = false;
    }

    if (data.isGstExemptST === "true") {
      data.isGstExempt = true;
    } else {
      data.isGstExempt = false;
    }
    //data.isGstExempt = false;

    //data.regionId = selectedRegionId

    delete data["isBillingContactST"];
    delete data["isGstExemptST"];
    if (
      savedExternalUser != null &&
      savedExternalUser.id !== undefined &&
      savedExternalUser.id !== ""
    ) {
      // update user profile

      dispatch(updateExternalUser(data));
    } else {
      dispatch(addNewExternalUser(data));
    }
  });

  // Regions DropDown Builder
  const regionSelector = regions.map((_region: any) => {
    if (_region.id)
      return (
        <option key={_region.id} value={_region.id}>
          {_region.region_name}
        </option>
      );
  });
  const getPropertyValue = (propertyName: string) => {
    if (savedExternalUser != null) {
      return savedExternalUser[propertyName];
    }
  };

  const isSelected = (propertyName: string, boxValue: string) => {
    if (savedExternalUser != null) {
      let savedValue = savedExternalUser[propertyName];
      return savedValue === boxValue;
    }
  };

  const IsCheckValid = (event: any) => {
    ///setError('firstName', { type: 'required'});

    //console.log(event,formState)
    // if(formState.isValid)
    // {
    //   toast.warn("Please fill all the mandatory values")
    // }

    let values: any = getValues();
    for (const property in values) {
      if (typeof values[property] === "string" && values[property] === "") {
        switch (property) {
          case "firstName":
            setError("firstName", { type: "required" });
            break;
          case "lastName":
            setError("lastName", { type: "required" });
            break;
          case "addressLine":
            setError("addressLine", { type: "required" });
            break;
          case "city":
            setError("city", { type: "required" });
            break;
          case "province":
            setError("province", { type: "required" });
            break;
          case "country":
            setError("country", { type: "required" });
            break;
          case "postalCode":
            setError("postalCode", { type: "required" });
            break;
          case "phoneNumber":
            setError("phoneNumber", { type: "required" });
            break;
          case "email":
            setError("email", { type: "required" });
            break;
          case "regionId":
            setError("regionId", { type: "required" });
            break;
          case "industry":
            setError("industry", { type: "required" });
            break;
          case "organization":
            setError("organization", { type: "required" });
            break;
          case "userWorkStatus":
            setError("userWorkStatus", { type: "required" });
            break;
          case "organizationTypeId":
            setError("organizationTypeId", { type: "required" });
            break;
          case "userFNStatus":
            setError("userFNStatus", { type: "required" });
            break;
          case "isGstExemptST":
            setError("isGstExemptST", { type: "required" });
            break;
        }
      }
        else if(typeof values[property] === "string" && values[property] === "")
        {
     
          switch (property) {
            case "firstName":
              clearErrors("firstName")
              break;
            case "lastName":
              clearErrors("lastName")
              break;
            case "addressLine":
              clearErrors("addressLine")
              break;
            case "city":
              clearErrors("city")
              break;
            case "province":
              clearErrors("province")
              break;
            case "country":
              clearErrors("country")
              break;
            case "postalCode":
              clearErrors("postalCode")
              break;
            case "phoneNumber":
              clearErrors("phoneNumber")
              break;
            case "email":
              clearErrors("email")
              break;
            case "regionId":
              clearErrors("regionId")
              break;
            case "industry":
              clearErrors("industry")
              break;
            case "organization":
              clearErrors("organization")
              break;
            case "userWorkStatus":
              clearErrors("userWorkStatus")
              break;
            case "organizationTypeId":
              clearErrors("organizationTypeId")
              break;
            case "userFNStatus":
              clearErrors("userFNStatus")
              break;
            case "isGstExemptST":
              clearErrors("isGstExemptST")
              break;
        }

        // if(property==="lastName")
        // setError("lastName", { type: 'required'})

        // if(property==="addressLine")
        // setError("addressLine", { type: 'required'})

        // if(property==="city")
        // setError("city", { type: 'required'})
      }
    }
  

    //setError("firstName", { type: "focus" }, { shouldFocus: true })
    //setError("firstName",{message:"Please fill this", type:"required" }, {shouldFocus:true})
  };

  return (
    <Container fluid className="g-4 pt-5 mt-4">
      <Row>
        <Col className="mx-md-5">
          <Form onSubmit={onSubmit}>
            <Row className="pt-4">
              <Col id="form-header" className="my-1">
                <p className="h4">Section 1 - Profile Information</p>
              </Col>
            </Row>
            <Row>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formFirstName"
              >
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  {...register("firstName", { required: true })}
                  aria-invalid={errors.firstName ? "true" : "false"}
                  type="text"
                  aria-placeholder="First Name"
                  placeholder="First Name"
                  required
                />
                <p className="errorMessage">
                  {" "}
                  {errors.firstName && errors.firstName.type === "required" && (
                    <span>First name is required</span>
                  )}
                </p>
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
                  aria-invalid={errors.lastName ? "true" : "false"}
                  required
                />
                <p className="errorMessage">
                  {" "}
                  {errors.lastName && errors.lastName.type === "required" && (
                    <span>Last name is required</span>
                  )}
                </p>
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
                  aria-invalid={errors.addressLine ? "true" : "false"}
                  required
                />
                <p className="errorMessage">
                  {" "}
                  {errors.addressLine &&
                    errors.addressLine.type === "required" && (
                      <span>Street address is required</span>
                    )}
                </p>
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
                  aria-invalid={errors.city ? "true" : "false"}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.city && errors.city.type === "required" && (
                    <span>City is required</span>
                  )}
                </p>
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
                  aria-invalid={errors.province ? "true" : "false"}
                  required
                />
                <p className="errorMessage">
                  {" "}
                  {errors.province && errors.province.type === "required" && (
                    <span>Province is required</span>
                  )}
                </p>
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
                  aria-invalid={errors.country ? "true" : "false"}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.country && errors.country.type === "required" && (
                    <span>Country is required</span>
                  )}
                </p>
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
                  aria-invalid={errors.postalCode ? "true" : "false"}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.postalCode &&
                    errors.postalCode.type === "required" && (
                      <span>Postal Code is required</span>
                    )}
                </p>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formPhoneNumber"
              >
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  {...register("phoneNumber",{pattern:{
                      value:/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g,
                      message: "Enter a valid phone number",}}
                      )}
                  type="text"
                  placeholder="Phone Number"
                  aria-placeholder="Phone Number"
                  required
                  aria-invalid={errors.phoneNumber ? "true" : "false"}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.phoneNumber &&
                    errors.phoneNumber.type === "required" && (
                      <span>Phone Number is required</span>
                    )}
                </p>
              </Form.Group>
              <Form.Group
                className="mb-2 col-xs-12 col-sm-6"
                controlId="formEmail"
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  {...register("email", {
                    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                  })}
                  type="email"
                  placeholder="Email"
                  aria-placeholder="Email"
                  required
                  aria-invalid={errors.email ? "true" : "false"}
                  isInvalid={errors?.email?.types===null}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.email && errors.email.type === "required" && (
                    <span>Email is required</span>
                  )}
                </p>
              </Form.Group>
            </Row>
            <Row className="pt-4">
              <Col id="form-header" className="my-1">
                <p className="h4">Section 2 - Additional Information</p>
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
                  aria-invalid={errors.regionId ? "true" : "false"}
                  onChange={(e) => {
                    handleRegionSelectChange(e);
                  }}
                >
                  <option value=""> Select Region</option>

                  {regionSelector}
                </Form.Select>
                <p className="errorMessage">
                  {" "}
                  {errors.regionId && errors.regionId.type === "required" && (
                    <span>Region is required</span>
                  )}
                </p>
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
                  aria-invalid={errors.industry ? "true" : "false"}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.industry && errors.industry.type === "required" && (
                    <span>Industry is required</span>
                  )}
                </p>
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
                  aria-invalid={errors.organization ? "true" : "false"}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.organization &&
                    errors.organization.type === "required" && (
                      <span>Organization is required</span>
                    )}
                </p>
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
                  aria-invalid={errors.userWorkStatus ? "true" : "false"}
                />
                <Form.Check
                  required
                  value="qp"
                  type="radio"
                  label="QP"
                  aria-invalid={errors.userWorkStatus ? "true" : "false"}
                  {...register("userWorkStatus")}
                />
                <Form.Check
                  required
                  value="public"
                  type="radio"
                  label="Public"
                  {...register("userWorkStatus")}
                  aria-invalid={errors.userWorkStatus ? "true" : "false"}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.userWorkStatus &&
                    errors.userWorkStatus.type === "required" && (
                      <span>Work Status is required</span>
                    )}
                </p>
              </Form.Group>
            </Row>
            <Row>
              <div key="radio" className="mb-3">
                <Form.Label>
                  Are you representing one of the following?
                </Form.Label>
                {organizationTypes.map((type: any) => {
                  return (
                    <Form.Check
                      key={type.id}
                      required
                      {...register("organizationTypeId")}
                      name="organizationTypeId"
                      value={type.id}
                      type="radio"
                      label={type.org_name}
                      aria-invalid={
                        errors.organizationTypeId ? "true" : "false"
                      }
                    />
                  );
                })}
                <p className="errorMessage">
                  {" "}
                  {errors.organizationTypeId &&
                    errors.organizationTypeId.type === "required" && (
                      <span>Organization Type is required</span>
                    )}
                </p>
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
                  aria-invalid={errors.userFNStatus ? "true" : "false"}
                />
                <Form.Check
                  required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="IN"
                  type="radio"
                  label="Inuit"
                  aria-invalid={errors.userFNStatus ? "true" : "false"}
                />
                <Form.Check
                  required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="MT"
                  type="radio"
                  label="Metis"
                  aria-invalid={errors.userFNStatus ? "true" : "false"}
                />
                <Form.Check
                  required
                  {...register("userFNStatus")}
                  name="userFNStatus"
                  value="NO"
                  type="radio"
                  label="None"
                  aria-invalid={errors.userFNStatus ? "true" : "false"}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.userFNStatus &&
                    errors.userFNStatus.type === "required" && (
                      <span>User First Nation Status is required</span>
                    )}
                </p>
              </div>
            </Row>
            <Row>
              <div key="radio" className="mb-3">
                <Form.Label>GST Exempt?</Form.Label>
                <Form.Check
                  required
                  value="true"
                  {...register("isGstExemptST")}
                  name="isGstExemptST"
                  type="radio"
                  label="Yes"
                  // checked = {isSelected("isBillingContact","true")}
                />
                <Form.Check
                  required
                  value="false"
                  {...register("isGstExemptST")}
                  name="isGstExemptST"
                  type="radio"
                  label="No"
                  // checked = {isSelected("isBillingContact","false")}
                />
                <p className="errorMessage">
                  {" "}
                  {errors.isGstExemptST &&
                    errors.isGstExemptST.type === "required" && (
                      <span>Gst Exempt is required</span>
                    )}
                </p>
              </div>
            </Row>

            {/* <Row className="pt-4">
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
            </Row> */}
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
                {savedExternalUser && (
                  <Button
                    id="back-profile-btn"
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                  >
                    Back
                  </Button>
                )}
                <Button
                  id="save-profile-btn"
                  type="submit"
                  onClick={(e) => IsCheckValid(e)}
                >
                  Save Profile
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};