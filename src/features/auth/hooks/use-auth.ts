import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useUserStore } from '../stores/user';
import type { LoginData, RegisterData } from '@/features/auth/types/auth';

export function useLogin() {
    const navigate = useNavigate();
    const { setUser, setToken } = useUserStore();

    return useMutation({
        mutationFn: (data: LoginData) => authApi.login(data),
        onSuccess: (data) => {
            setUser(data.user);
            setToken(data.token);
            navigate('/');
        },
    });
}

export function useRegister() {
    const navigate = useNavigate();
    const { setUser, setToken } = useUserStore();

    return useMutation({
        mutationFn: (data: RegisterData) => authApi.register(data),
        onSuccess: (data) => {
            setUser(data.user);
            setToken(data.token);
            navigate('/');
        },
    });
}

export function useLogout() {
    const navigate = useNavigate();
    const logout: () => void = useUserStore((state) => state.logout);

    return () => {
        logout();
        navigate('/login');
    };
}