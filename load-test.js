import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 500 },  // Ramp up to 500 users
    { duration: '1m', target: 2500 }, // Ramp up to 2500 users
    { duration: '2m', target: 2500 }, // Stay at 2500 users
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
  },
};

const BASE_URL = 'http://localhost:8080/api';

export default function () {
  // 1. Simulate Login
  const loginPayload = JSON.stringify({
    email: 'testuser@ritchennai.edu.in',
    password: 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);

  check(loginRes, {
    'login success': (r) => r.status === 200,
  });

  if (loginRes.status === 200) {
    const token = loginRes.json('token');
    const authParams = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // 2. Fetch Timetable (Cached endpoint)
    const timetableRes = http.get(`${BASE_URL}/academic/timetable?department=CS&semester=6`, authParams);
    check(timetableRes, {
      'timetable success': (r) => r.status === 200,
    });

    // 3. Query Chatbot (Caches repeat queries)
    const chatbotRes = http.post(`${BASE_URL}/chatbot/query`, JSON.stringify({
      query: 'how to check attendance',
      email: 'testuser@ritchennai.edu.in'
    }), authParams);
    
    check(chatbotRes, {
      'chatbot success': (r) => r.status === 200,
    });
  }

  sleep(1);
}
