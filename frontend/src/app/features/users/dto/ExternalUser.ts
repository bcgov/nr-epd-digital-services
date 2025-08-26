export class ExternalUser {
  userId?: String | undefined = "";
  firstName: String = "";
  lastName: String = "";
  addressLine: String = "";
  city: String = "";
  province: String = "";
  country: String = "";
  postalCode: String = "";
  email: String = "";
  phoneNumber: String = "";
  organization: String = "";
  userWorkStatus: String = "";
  userFNStatus: String = "";
  isGstExempt: Boolean = false;
  isBillingContact: Boolean = false;
  isProfileVerified: Boolean = false;
  industry: String = "";
  regionId: String = "";
  organizationTypeId: String = "";
  isBillingContactST?: string = "";
  isGstExemptST?: string = "";
}
