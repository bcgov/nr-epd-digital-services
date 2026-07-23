/**
 * Serializable bulk People update input. Timestamps cross the Redux boundary
 * as ISO-8601 strings rather than Date objects so serializability checks can
 * remain enabled.
 */
export interface PeopleUpdateInput {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  isTaxExempt?: boolean | null;
  isEnvConsultant?: boolean | null;
  loginUserName?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  prov?: string | null;
  country?: string | null;
  postal?: string | null;
  phone?: string | null;
  mobile?: string | null;
  fax?: string | null;
  email?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  updatedBy?: string | null;
  /** ISO-8601 timestamp string */
  updatedDatetime?: string | null;
}

export interface PeopleUpdateFailure {
  message: string;
}
