// hooks/useAuth.ts
import AuthService from '@/services/auth.service'
import { useEffect, useState } from 'react'

interface AuthOptions {
    requiredRole?: Array<'ADMINISTRADOR' | 'EMPLEADO'>
    redirectTo?: string
}

export const useAuth = ({ requiredRole, redirectTo }: AuthOptions = {}) => {
    const [user, setUser] = useState<StoredUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const currentUser = AuthService.getCurrentUser()

            if (!currentUser) {
                if (redirectTo) window.location.href = redirectTo
                setIsLoading(false)
                return
            }

            if (requiredRole && !requiredRole.includes(currentUser.tipo)) {
                setUser(null)
            } else if (!user || user.id !== currentUser.id) {
                setUser(currentUser)
            }

            setIsLoading(false)
        }

        checkAuth()
    }, [requiredRole, redirectTo]) // Eliminadas dependencias circulares

    return { user, isLoading }
}