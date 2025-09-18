import { api } from '@/lib/api/axios';
import type { LoginData, RegisterData, AuthResponse } from '@/features/auth/types/auth';

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);
    formData.append('username', data.username);
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    const response = await api.post<AuthResponse>('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};