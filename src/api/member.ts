import { apiClient } from './client';
import { MemberDetail } from '../types/member';

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
