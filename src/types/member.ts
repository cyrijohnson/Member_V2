export interface DistrictInfo {
  districtId?: string;
  districtName?: string;
  description?: string;
  districtAddress?: string;
  addrFId?: string | null;
  userId?: string;
  areaId?: string;
}

export interface Address {
  addressId?: string;
  memberId?: string;
  addressLine1?: string;
  addressLine2?: string;
  locality?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}

export interface MetaLocalAssemblyDTO {
  assemblyId?: string;
  assemblyName?: string;
  assemblyAddress?: Address;
  userId?: string;
  description?: string | null;
  districtId?: string;
  district?: DistrictInfo;
  langSpoken?: string;
  assemblyType?: string | null;
  assemblyTypeId?: string;
}

export interface MetaProfessionCategory {
  id?: string;
  name?: string;
  description?: string;
  ProfCatId?: string;
  ProfCatName?: string;
  ProfCatDesc?: string;
}

export interface ProfessionCategoryOption {
  ProfCatId: string;
  ProfCatName: string;
  ProfCatDesc: string;
}

export interface SalvationStatus {
  assuranceId?: string;
  memberId?: string;
  localAssemblyId?: string;
  officiatingMinister?: string;
  salvationStatusText?: string;
  date?: string;
  communicantBool?: boolean;
  externalAssembly?: boolean;
}

export interface BaptistStatus {
  description?: string;
  date?: string;
}

export interface MetaHomeCellDTO {
  id?: string;
  name?: string;
}

export interface DataFiles {
  id?: string;
  url?: string;
  fileName?: string;
}

export interface DisabilityType {
  id?: string;
  description?: string;
  medCondition?: string;
  mobilitySupport?: boolean;
}

export interface DisabilityTypeOption {
  DisabilityId: string;
  DisabilityName: string;
  MedCondition: string;
  MobilitySupport: boolean;
}

export interface MemberDetail {
  memberId: string;
  localAssembly?: MetaLocalAssemblyDTO;
  profCat?: MetaProfessionCategory | null;
  memberAddress?: Address;
  salvationStatus?: SalvationStatus;
  baptismStatus?: BaptistStatus[];
  homeCell?: MetaHomeCellDTO | null;
  profilePicture?: DataFiles | null;
  disabilityType?: DisabilityType | null;
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  nationality?: string;
  countryOfBirth?: string;
  countryOfResidence?: string;
  maritalStatus?: string;
  mobileNumber?: string;
  emailAddress?: string;
  telNumber?: string;
  profession?: string;
  churchStatus?: string;
  emergencyContact?: string;
  childFlag?: boolean;
  disabled?: boolean;
  dateOfJoining?: string;
  birthPlace?: string;
  homeTown?: string;
  dedicationDate?: string;
  waterBaptised?: boolean;
  hsBaptised?: boolean;
}
