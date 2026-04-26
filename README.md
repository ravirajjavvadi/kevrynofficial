# 🚨 SARATHI — Emergency Navigation System

AI-powered emergency response platform for ambulance, police, and fire services. Smart routing, hospital selection, and real-time coordination.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/)

## ✨ Key Features

- 🗺️ **AI-Powered Routing** — Smart route analysis with real-time traffic via Groq AI
- 🏥 **Hospital Network** — Bed availability & specialty filtering
- ⚡ **Green Corridor** — Automated traffic alert system for emergency corridors
- 🎙️ **Voice Assistant** — Hands-free navigation for drivers
- 📍 **Real-Time Tracking** — Live location updates & ETA calculations
- 🔐 **Secure Auth** — OTP-based driver verification
- 📱 **PWA Support** — Installable on mobile devices

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| State | Zustand |
| Maps | Google Maps API |
| AI | Groq API (Mixtral-8x7b) |
| DB | MongoDB Atlas |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Add environment variables
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_GOOGLE_MAPS_KEY, GROQ_API_KEY, MONGODB_URI

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
├── (auth)/          # Driver login & registration
├── (dashboard)/     # Driver, hospital, police, public portals
├── api/             # Groq AI, hospital, traffic API routes
└── page.tsx         # Landing page

components/
├── shared/          # Navbar, StatCard, VoiceAssistant, ...
└── map/             # Google Maps integration
```

## 🌐 Deployment

Deployed on **Vercel** — auto-deploys on push to `main`.

```bash
git push origin main
```

## 👥 Contributors

| Username | Contributions |
|----------|--------------|
| [@ravirajjavvadi](https://github.com/ravirajjavvadi) | Project founder & core development |
| [@rickeygona](https://github.com/rickeygona) | CSS button utilities, StatCard component, stats banner, SEO metadata, footer improvements, README |

---

> Built with ❤️ for emergency responders
