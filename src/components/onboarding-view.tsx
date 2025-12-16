"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Package, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { NewSaleDialog } from "@/components/sales/new-sale-dialog" // We might want a specialized "Add Item" dialog for onboarding, but redirect to inventory/new is fine too.

interface OnboardingViewProps {
    userName: string
    businessType?: string
}

export function OnboardingView({ userName, businessType }: OnboardingViewProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-8 max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
            >
                <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <TrendingUp className="h-12 w-12 text-primary" />
                </div>

                <h1 className="text-4xl font-bold tracking-tight">
                    Welcome to Stockly, {userName}! 👋
                </h1>
                <p className="text-xl text-muted-foreground">
                    {businessType
                        ? `Your ${businessType} business is ready to take off.`
                        : "Your business is ready to take off."}
                    <br />
                    Let's start by adding your first product to inventory.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full max-w-sm"
            >
                <div className="grid gap-4">
                    <Link href="/dashboard/inventory/new">
                        <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                            <Plus className="mr-2 h-6 w-6" /> Add First Product
                        </Button>
                    </Link>

                    <p className="text-sm text-muted-foreground">
                        Takes less than 30 seconds
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12 w-full"
            >
                <OnboardingFeature
                    icon={<Package className="h-5 w-5 text-blue-500" />}
                    title="Track Stock"
                    description="Know exactly what you have and when to restock."
                />
                <OnboardingFeature
                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                    title="Record Sales"
                    description="Log daily sales and track your profit growth."
                />
                <OnboardingFeature
                    icon={<div className="h-5 w-5 rounded-full border-2 border-orange-500" />} // Placeholder icon styling
                    title="Get Insights"
                    description="See which products are making you the most money."
                />
            </motion.div>
        </div>
    )
}

function OnboardingFeature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
            <div className="mb-2 w-fit rounded-lg bg-background p-2 shadow-sm">
                {icon}
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}
