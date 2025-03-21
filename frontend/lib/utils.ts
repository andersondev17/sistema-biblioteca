import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Obtiene las iniciales de un nombre para mostrar en el avatar
export const getInitials = (name: string = '') => 
  name.split(' ')
    .filter(Boolean)
    .map(word => word[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || '?'

// Obtiene el color de fondo para el avatar basado en el nombre del usuario
export const getAvatarColor = (name: string = '') => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-red-500', 'bg-purple-500', 'bg-pink-500'
  ]
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}