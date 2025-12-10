import { apiClient } from './client';
import { MemberDetail } from '../types/member';

export interface UpdateMyDetailsResult {
  member: MemberDetail;
  wasEmptySuccess: boolean;
}

const toCamelCase = (value: unknown): unknown => {
  const normalizeKey = (key: string) => {
    if (/^[a-z][a-z0-9]*([A-Z][a-z0-9]+)*$/.test(key)) {
      return key; // already camelCase
    }

    const spaced = key
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .split(' ')
      .filter(Boolean);

    return spaced
      .map((segment, index) => {
        const lower = segment.toLowerCase();
        if (index === 0) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join('');
  };

  if (Array.isArray(value)) {
    return value.map((entry) => toCamelCase(entry));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
      (acc, [key, nestedValue]) => {
        const camelKey = normalizeKey(key);
        acc[camelKey] = toCamelCase(nestedValue);
        return acc;
      },
      {}
    );
  }

  return value;
};

export const getMyDetails = async (): Promise<MemberDetail> => {
  const response = await apiClient.get('api/MemebershipManager/getMyDetails');
  const payload = toCamelCase(response.data);

  if (!payload || typeof payload !== 'object') {
    throw new Error('Empty profile payload received');
  }

  return payload as MemberDetail;
};

const isEmptyResponseBody = (body: unknown) => {
  if (body === undefined || body === null) return true;
  if (typeof body === 'string') return body.trim().length === 0;
  if (Array.isArray(body)) return body.length === 0;
  if (typeof body === 'object') return Object.keys(body as Record<string, unknown>).length === 0;
  return false;
};

export const updateMyDetails = async (payload: MemberDetail): Promise<UpdateMyDetailsResult> => {
  if (!payload.memberId) {
    throw new Error('Member ID is required to update profile details');
  }

  const baptistStatuses = payload.baptismStatus as Array<{ id?: string }> | undefined;
  const extraFields = payload as { status?: string; refMemberId?: string };

  const requestPayload = {
    MemberId: payload.memberId,
    LocalAssemblyId: payload.localAssembly?.assemblyId,
    ProfCatId: payload.profCat?.ProfCatId ?? payload.profCat?.profCatId ?? payload.profCat?.id,
    MemberAddress:
      payload.memberAddress?.addressId ?? (payload.memberAddress as { id?: string } | undefined)?.id,
    AssuranceId: payload.salvationStatus?.assuranceId,
    BaptismStatusId: baptistStatuses?.[0]?.id,
    homeCellId: payload.homeCell?.id,
    ProfilePictureId: payload.profilePicture?.id,
    Title: payload.title,
    FirstName: payload.firstName,
    MiddleName: payload.middleName,
    LastName: payload.lastName,
    DOB: payload.dob,
    Gender: payload.gender,
    Nationality: payload.nationality,
    CountryOfBirth: payload.countryOfBirth,
    CountryOfResidence: payload.countryOfResidence,
    MaritalStatus: payload.maritalStatus,
    MobileNumber: payload.mobileNumber,
    EmailAddress: payload.emailAddress,
    TelNumber: payload.telNumber,
    Profession: payload.profession,
    ChurchStatus: payload.churchStatus,
    EmergencyContact: payload.emergencyContact,
    ChildFlag: payload.childFlag,
    Disabled: payload.disabled,
    DisabilityType:
      payload.disabilityType?.id ??
      (payload.disabilityType as { DisabilityId?: string } | null | undefined)?.DisabilityId,
    DateOfJoining: payload.dateOfJoining,
    BirthPlace: payload.birthPlace,
    HomeTown: payload.homeTown,
    DedicationDate: payload.dedicationDate,
    WaterBaptised: payload.waterBaptised,
    HSBaptised: payload.hsBaptised,
    Status: extraFields.status,
    RefMemberId: extraFields.refMemberId
  };

  const sanitizedPayload = Object.fromEntries(
    Object.entries(requestPayload).filter(([, value]) => value !== undefined)
  );

  const response = await apiClient.put(`api/Members/${payload.memberId}`, sanitizedPayload);
  const { data, status } = response;
  const isSuccessStatus = status >= 200 && status < 300;

  if (isSuccessStatus && isEmptyResponseBody(data)) {
    return { member: payload, wasEmptySuccess: true };
  }

  const camelCaseData = toCamelCase(data);

  if (!camelCaseData || typeof camelCaseData !== 'object') {
    if (isSuccessStatus) {
      return { member: payload, wasEmptySuccess: true };
    }
    throw new Error('Empty profile payload received after update');
  }

  return { member: camelCaseData as MemberDetail, wasEmptySuccess: false };
};
