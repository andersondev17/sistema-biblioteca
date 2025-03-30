"use client";

import { useLoading } from "@/contexts/LoadingContext";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function LoadingBar() {
    const { isLoading } = useLoading();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<{
        progress: NodeJS.Timeout | null;
        hide: NodeJS.Timeout | null;
    }>({
        progress: null,
        hide: null
    });
    const routeChangeRef = useRef(false);

    // Limpiar todos los timers al desmontar
    useEffect(() => {
        return () => {
            if (timerRef.current.progress) clearInterval(timerRef.current.progress);
            if (timerRef.current.hide) clearTimeout(timerRef.current.hide);
        };
    }, []);

    // Efecto para cambios de ruta
    useEffect(() => {
        // Evitar procesamiento innecesario si ya está en progreso
        if (routeChangeRef.current) return;

        // Limpiar timers existentes
        if (timerRef.current.progress) clearInterval(timerRef.current.progress);
        if (timerRef.current.hide) clearTimeout(timerRef.current.hide);

        routeChangeRef.current = true;
        setVisible(true);
        setProgress(30); // Inicio más rápido para cambios de ruta

        // Completar progreso después de un tiempo
        const timer = setTimeout(() => {
            setProgress(100);
            timerRef.current.hide = setTimeout(() => {
                setVisible(false);
                routeChangeRef.current = false;
                setProgress(0);
            }, 300);
        }, 400);

        return () => {
            clearTimeout(timer);
            if (timerRef.current.hide) clearTimeout(timerRef.current.hide);
        };
    }, [pathname, searchParams]);

    // Efecto para estado de carga global
    useEffect(() => {
        // Limpiar timers existentes
        if (timerRef.current.progress) clearInterval(timerRef.current.progress);
        if (timerRef.current.hide) clearTimeout(timerRef.current.hide);

        if (isLoading) {
            setVisible(true);
            setProgress(10);

            // Incrementar gradualmente hasta 90%
            timerRef.current.progress = setInterval(() => {
                setProgress(prev => {
                    // Aumentar más lentamente al acercarse a 90%
                    const increment = Math.max(1, (90 - prev) / 10);
                    return prev >= 90 ? 90 : Math.min(90, prev + increment);
                });
            }, 400);
        } else if (visible) {
            // Finalizar la barra cuando termina la carga
            setProgress(100);
            timerRef.current.hide = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);
        }
    }, [isLoading, visible]);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1">
            <div className="w-full h-full bg-transparent">
                <div
                    className="h-full bg-gradient-to-r from-primary-admin via-blue-400 to-primary-admin transition-all duration-300 ease-in-out"
                    style={{
                        width: `${progress}%`,
                        opacity: progress === 100 ? 0 : 1
                    }}
                />
            </div>
        </div>
    );
}