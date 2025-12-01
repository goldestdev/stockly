# Stockly - Inventory Management for Small Vendors

Stockly is a mobile-first inventory management SaaS designed specifically for small vendors (Instagram sellers, WhatsApp merchants, etc.) to track their stock, sales, and profits.

## 🚀 Live Demo
**[https://stockly-three-omega.vercel.app/](https://stockly-three-omega.vercel.app/)**

## ✨ Key Features

- **📦 Inventory Tracking**: Easily add items, track quantities, and manage stock levels.
- **💰 Profit Tracking**: Real-time calculation of total inventory value, potential revenue, and profit.
- **🔔 Low Stock Alerts**: Automatic email notifications (via Resend) when items run low.
- **📊 Dashboard Analytics**: Visual charts and real-time metrics to track business growth.
- **📝 Sales Recording**: Record transactions instantly and view recent sales history.
- **🔍 Smart Search & Filter**: Quickly find inventory items and filter by stock status.
- **🔐 Subscription Gating**:
    - **Free Plan**: Limited to 15 items.
    - **Pro Plan**: Unlimited items for ₦1,500/month (via Paystack).
- **🌓 Dark Mode**: Beautiful, premium dark theme that syncs with system settings.
- **📱 Mobile First**: Optimized for use on smartphones.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Payments**: [Paystack](https://paystack.com/)
- **Emails**: [Resend](https://resend.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Paystack account
- A Resend account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/goldestdev/stockly.git
    cd stockly
    ```

2.  **Install dependencies**
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory and add the following:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
    RESEND_API_KEY=your_resend_api_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The project uses Supabase with the following main tables:
- `profiles`: Stores user details, subscription plan (`free` or `pro`), and theme preference.
- `items`: Stores inventory items, quantities, costs, and prices.
- `sales`: Records transaction history, quantities sold, and revenue.

## 🚀 Deployment

The app is optimized for deployment on Vercel.
1.  Push code to GitHub.
2.  Import project to Vercel.
3.  Add the Environment Variables in Vercel Project Settings.
4.  Deploy!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
