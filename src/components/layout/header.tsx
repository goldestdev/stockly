"use client"

import { Bell } from "lucide-react"

export function Header({ title = "Stockly", showProfile = true }: { title?: string, showProfile?: boolean }) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-xl">
            <h1 className="text-xl font-bold tracking-tight text-primary">{title}</h1>

            {showProfile && (
                <div className="flex items-center gap-4">
                    <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background"></span>
                    </button>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500"></div>
                </div>
            )}
        </header>
    )
}
