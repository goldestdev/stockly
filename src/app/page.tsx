'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, Zap, CheckCircle2, Package, TrendingUp, Users } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <span className="font-bold text-lg">Stockly</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Simple Inventory Tracking
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Track Inventory.
            <br />
            <span className="text-primary">Grow Sales.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
          >
            The simple inventory tracker for vendors. No spreadsheets, no complexity. Just track what you have and watch your business grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full h-11 px-6">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-11 px-6">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Active Users', value: '2,000+' },
            { label: 'Items Tracked', value: '50K+' },
            { label: 'Sales Recorded', value: '₦10M+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything You Need</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Simple tools to help you manage inventory and grow your business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Package,
                title: 'Real-Time Stock',
                desc: 'Always know what you have. Update quantities instantly.',
                color: 'text-blue-500',
                bg: 'bg-blue-500/10',
              },
              {
                icon: Zap,
                title: 'Low Stock Alerts',
                desc: 'Get notified before you run out of best-sellers.',
                color: 'text-orange-500',
                bg: 'bg-orange-500/10',
              },
              {
                icon: TrendingUp,
                title: 'Sales Analytics',
                desc: 'See what sells and when. Make smarter decisions.',
                color: 'text-green-500',
                bg: 'bg-green-500/10',
              },
              {
                icon: CheckCircle2,
                title: 'Easy Recording',
                desc: 'Record sales in 3 taps. Inventory updates automatically.',
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
              },
              {
                icon: BarChart3,
                title: 'Profit Tracking',
                desc: 'Know your margins. Track cost and selling prices.',
                color: 'text-pink-500',
                bg: 'bg-pink-500/10',
              },
              {
                icon: Users,
                title: 'Team Ready',
                desc: 'Works for solo vendors and small teams alike.',
                color: 'text-cyan-500',
                bg: 'bg-cyan-500/10',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 sm:p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className={`h-10 w-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-24 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of vendors who trust Stockly to manage their inventory.
          </p>
          <Link href="/signup">
            <Button size="lg" className="rounded-full h-12 px-8">
              Start Tracking Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="font-semibold">Stockly</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 Stockly. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
