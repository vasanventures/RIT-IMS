import api from './api';

export interface Request {
  id: number;
  type: 'LEAVE' | 'OD' | 'CERTIFICATE' | 'NODUE';
  reason: string;
  startDate?: string;
  endDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const requestService = {
  getStudentRequests: async (studentId: number) => {
    const response = await api.get<Request[]>(`/requests/${studentId}`);
    return response.data;
  },

  submitRequest: async (request: Partial<Request>) => {
    const response = await api.post('/requests', request);
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get<Request[]>('/requests/pending');
    return response.data;
  },

  updateRequestStatus: async (requestId: number, status: string) => {
    const response = await api.patch(`/requests/${requestId}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};
