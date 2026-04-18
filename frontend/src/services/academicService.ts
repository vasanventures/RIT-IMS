import api from './api';

export interface Attendance {
  id: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  subject: {
    id: number;
    name: string;
    code: string;
  };
}

export interface Mark {
  id: number;
  examType: string;
  score: number;
  subject: {
    id: number;
    name: string;
    code: string;
  };
}

export interface TimetableEntry {
  id: number;
  dayOfWeek: string;
  period: number;
  department: string;
  semester: number;
  subject: {
    id: number;
    name: string;
    code: string;
  };
  faculty: {
    id: number;
    user: {
      name: string;
    };
  };
}

export const academicService = {
  getAttendance: async (studentId: number) => {
    const response = await api.get<Attendance[]>(`/academic/attendance/${studentId}`);
    return response.data;
  },

  getMarks: async (studentId: number) => {
    const response = await api.get<Mark[]>(`/academic/marks/${studentId}`);
    return response.data;
  },

  getTimetable: async (department: string, semester: number) => {
    const response = await api.get<TimetableEntry[]>(`/academic/timetable`, {
      params: { department, semester }
    });
    return response.data;
  },

  uploadMarks: async (marks: Partial<Mark>[]) => {
    const response = await api.post('/academic/marks', marks);
    return response.data;
  },

  markAttendance: async (attendance: Partial<Attendance>[]) => {
    const response = await api.post('/academic/attendance', attendance);
    return response.data;
  }
};
