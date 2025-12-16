"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Plus, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { NewSaleDialog } from "@/components/sales/new-sale-dialog"

export function BottomNav() {
    const pathname = usePathname()
    const [showNewSale, setShowNewSale] = useState(false)

    const links = [
        {
            href: "/dashboard",
            icon: Home,
            label: "Home",
        },
        {
            href: "/dashboard/inventory",
            icon: Package,
            label: "Inventory",
        },
        // Middle space for FAB
        {
            href: "/dashboard/reports",
            icon: BarChart3,
            label: "Reports",
        },
        {
            href: "/dashboard/settings",
            icon: Settings,
            label: "Settings",
        },
    ]

    // Helper to determine active state
    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/")

    return (
        <>
            <NewSaleDialog open={showNewSale} onOpenChange={setShowNewSale} />

            {/* Floating Action Button (FAB) */}
            <div className="fixed bottom-[90px] right-6 z-50 md:hidden">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/30"
                    onClick={() => setShowNewSale(true)}
                >
                    <Plus className="h-8 w-8" />
                </motion.button>
            </div>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 block h-20 border-t bg-background/80 backdrop-blur-lg md:hidden">
                <div className="flex h-full items-center justify-around px-2">
                    {links.map((link, index) => {
                        const active = link.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname?.startsWith(link.href)

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
                                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <link.icon className={cn("h-6 w-6", active && "fill-current")} strokeWidth={active ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{link.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
