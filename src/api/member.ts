import { apiClient } from './client';
import { MemberDetail } from '../types/member';

const toCamelCase = (value: unknown): unknown => {
  const normalizeKey = (key: string) => {
    // Handle full uppercase keys like "DOB" or "HSBAPTISED"
    if (/^[A-Z0-9_]+$/.test(key)) {
      return key.toLowerCase();
    }

    // Convert underscore or hyphen separated keys and PascalCase to camelCase
    const separatorNormalized = key.replace(/[-_]+([a-zA-Z0-9])/g, (_, group) => group.toUpperCase());
    return separatorNormalized.charAt(0).toLowerCase() + separatorNormalized.slice(1);
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
  return toCamelCase(response.data) as MemberDetail;
};
