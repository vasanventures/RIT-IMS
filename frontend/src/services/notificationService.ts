import api from './api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  targetRole: string;
  department?: string;
  createdDate: string;
}

export const notificationService = {
  getNotifications: async (role?: string) => {
    const response = await api.get<Notification[]>('/notifications', {
      params: { role }
    });
    return response.data;
  },

  sendNotification: async (notification: Partial<Notification>) => {
    const response = await api.post('/notifications', notification);
    return response.data;
  }
};
