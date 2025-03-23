'use client';

import { LoginFormValues, RegisterFormValues } from "@/lib/validations";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

// Tipo de usuario almacenado en local storage
interface StoredUser {
    id: number;
    userName: string;
    tipo: 'ADMINISTRADOR' | 'EMPLEADO';
}

// Utilidades de almacenamiento seguro
export const storage = {
    get: <T>(key: string): T | null => {
        if (typeof window === 'undefined') return null;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },
    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    }
};

// Utilidad para fetch con manejo de errores
const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const token = storage.get<string>(TOKEN_KEY);
    console.log("Token recuperado:", token);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options?.headers || {})
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en la operación');
    }

    return data;
};

const AuthService = {
    login: async (credentials: LoginFormValues): Promise<StoredUser> => {
        const { token, user } = await apiFetch<{ token: string; user: StoredUser }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        storage.set(TOKEN_KEY, token);
        storage.set(USER_KEY, user);
        console.log("Token guardado:", token);

        return user;
    },
    logout: async (): Promise<void> => {
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            storage.remove(TOKEN_KEY);
            storage.remove(USER_KEY);
        }
    },

    register: async (userData: RegisterFormValues) =>
        apiFetch('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
    isAuthenticated: () => !!storage.get<string>(TOKEN_KEY),

    getCurrentUser: (): StoredUser | null => storage.get<StoredUser>(USER_KEY),

    isAdmin: (): boolean => AuthService.getCurrentUser()?.tipo === 'ADMINISTRADOR',

    getToken: (): string | null => storage.get<string>(TOKEN_KEY)

};

export default AuthService;