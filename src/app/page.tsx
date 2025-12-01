'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, BarChart3, ShieldCheck, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { motion, Variants } from 'framer-motion'

export default function LandingPage() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 opacity-30" />

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold tracking-tight">Stockly</span>
          </div>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          <motion.div variants={item} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            The #1 Inventory Tracker for Modern Vendors
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tight">
            Stop Losing Sales. <br />
            <span className="text-gradient">Start Tracking Growth.</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The dead-simple inventory tracker designed for vendors who sell clothes, shoes, wigs, and perfumes. 
            No complex spreadsheets, just pure profit.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 transition-all hover:scale-105">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-secondary/50">
                See How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.6, type: "spring" }}
            className="mt-20 relative mx-auto max-w-4xl perspective-1000"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20"></div>
              <div className="relative rounded-2xl border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b bg-card/50">
                  <div className="p-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="text-xl font-bold">₦2.4M</p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Active Items</p>
                      <p className="text-xl font-bold">142</p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Low Stock</p>
                      <p className="text-xl font-bold">3 Items</p>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-card/30">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-secondary animate-pulse"></div>
                          <div className="space-y-2">
                            <div className="h-4 w-32 rounded bg-secondary animate-pulse"></div>
                            <div className="h-3 w-20 rounded bg-secondary animate-pulse"></div>
                          </div>
                        </div>
                        <div className="h-8 w-24 rounded bg-secondary animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="max-w-6xl mx-auto mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to grow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features packed into a simple, easy-to-use interface.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Track Stock Instantly",
                desc: "Know exactly what you have. Update quantities with a single tap as you sell.",
                icon: CheckCircle2,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              },
              {
                title: "Low Stock Alerts",
                desc: "Never run out of best-sellers. See what needs restocking before it's too late.",
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              },
              {
                title: "Mobile Friendly",
                desc: "Designed for your phone. Use it at the market, shop, or on the go.",
                icon: BarChart3,
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-3xl border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-12 w-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="border-t py-12 text-center text-sm text-muted-foreground">
        <p>© 2024 Stockly. All rights reserved.</p>
      </footer>
    </div>
  )
}
