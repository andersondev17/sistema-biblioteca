'use client'

import Header from "@/components/Header"
import { ReactNode } from "react"

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main className="root-container">
            <div className="sticky top-0 z-50 transition-all duration-300">
                <div className="mx-auto max-w-7xl px-5 xs:px-10 md:px-16">
                    <Header />
                </div>
            </div>
        
            <div className="mx-auto max-w-7xl px-5 xs:px-10 md:px-16 pt-6 pb-20">
                {children}
            </div>
        </main>
    )
}

export default RootLayout