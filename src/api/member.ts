import { apiClient } from './client';
import { MemberDetail } from '../types/member';

export const getMyDetails = async (): Promise<MemberDetail> => {
  const response = await apiClient.get<MemberDetail>('api/MemebershipManager/getMyDetails');
  return response.data;
};
