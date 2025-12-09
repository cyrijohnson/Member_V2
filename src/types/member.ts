export interface MetaLocalAssemblyDTO {
  id?: string;
  name?: string;
}

export interface MetaProfessionCategory {
  id?: string;
  name?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface SalvationStatus {
  description?: string;
  date?: string;
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
}

export interface MemberDetail {
  memberId: string;
  localAssembly?: MetaLocalAssemblyDTO;
  profCat?: MetaProfessionCategory;
  memberAddress?: Address;
  salvationStatus?: SalvationStatus;
  baptismStatus?: BaptistStatus[];
  homeCell?: MetaHomeCellDTO;
  ProfilePicture?: DataFiles;
  DisabilityType?: DisabilityType;
  Title?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  DOB?: string;
  Gender?: string;
  Nationality?: string;
  CountryOfBirth?: string;
  CountryOfResidence?: string;
  MaritalStatus?: string;
  MobileNumber?: string;
  EmailAddress?: string;
  TelNumber?: string;
  Profession?: string;
  ChurchStatus?: string;
  EmergencyContact?: string;
  ChildFlag?: boolean;
  Disabled?: boolean;
  DateOfJoining?: string;
  BirthPlace?: string;
  HomeTown?: string;
  DedicationDate?: string;
  WaterBaptised?: boolean;
  HSBaptised?: boolean;
}
