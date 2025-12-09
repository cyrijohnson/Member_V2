import { apiClient } from './client';
import { MemberDetail } from '../types/member';

const toCamelCase = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((entry) => toCamelCase(entry));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
      (acc, [key, nestedValue]) => {
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
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
  return toCamelCase(response.data) as MemberDetail;
};
