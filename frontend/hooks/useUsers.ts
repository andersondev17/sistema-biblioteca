// hooks/useUsers.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export function useUsers(initialId?: string) {
    const [users, setUsers] = useState<Usuario[]>([]);
    const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    // Caché simple
    const cache = useRef({
        timestamp: 0,
        users: [] as Usuario[],
        details: {} as Record<number, Usuario>
    });

    // Cargar usuarios con caché
    const loadUsers = useCallback(async (force = false) => {
        // Usar caché si es válida (menos de 1 minuto)
        if (!force && cache.current.users.length && Date.now() - cache.current.timestamp < 60000) {
            setUsers(cache.current.users);
            setLoading(false);
            return cache.current.users;
        }

        setLoading(true);

        try {
            const service = await import("@/services/user.service").then(m => m.default);
            const data = await service.getAllUsers();

            // Actualizar caché y estado
            cache.current = {
                timestamp: Date.now(),
                users: data,
                details: cache.current.details
            };
            setUsers(data);
            return data;
        } catch (error) {
            console.error("Error cargando usuarios:", error);
            toast.error("Error al cargar usuarios");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener detalles de usuario
    const getUser = useCallback(async (id: number) => {
        // Buscar en caché primero
        if (cache.current.details[id]) {
            setCurrentUser(cache.current.details[id]);
            return cache.current.details[id];
        }

        // Buscar en lista cargada
        const foundUser = users.find(u => u.id === id);
        if (foundUser) {
            cache.current.details[id] = foundUser;
            setCurrentUser(foundUser);
            return foundUser;
        }

        try {
            const service = await import("@/services/user.service").then(m => m.default);
            const data = await service.getUserById(id);

            // Actualizar caché y estado
            cache.current.details[id] = data;
            setCurrentUser(data);
            return data;
        } catch (error) {
            console.error(`Error al cargar usuario (${id}):`, error);
            return null;
        }
    }, [users]);

    // Eliminar usuario (actualización optimista)
    const deleteUser = useCallback(async (id: number) => {
        try {
            // Actualizar UI inmediatamente
            setUsers(users => users.filter(u => u.id !== id));

            // Realizar petición
            const service = await import("@/services/user.service").then(m => m.default);
            await service.deleteUser(id);

            // Actualizar caché
            cache.current.users = cache.current.users.filter(u => u.id !== id);
            delete cache.current.details[id];

            return true;
        } catch (error) {
            console.error("Error:", error);
            loadUsers(true); // Recargar en caso de error
            return false;
        }
    }, [loadUsers]);

    // Inicialización
    useEffect(() => {
        loadUsers();
        if (initialId) getUser(Number(initialId));
    }, [loadUsers, getUser, initialId]);

    return {
        users,
        currentUser,
        loading,
        refresh: () => loadUsers(true),
        getUser,
        deleteUser
    };
}