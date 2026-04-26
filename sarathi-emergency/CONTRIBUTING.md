# Contributing to SARATHI

Thank you for your interest in contributing to SARATHI Emergency Navigation System! 🚨

## Environment Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/ravirajjavvadi/sarathi.git
cd sarathi

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local with the following keys:
#   NEXT_PUBLIC_GOOGLE_MAPS_KEY   – Google Maps JavaScript API key
#   GROQ_API_KEY                  – Groq AI API key
#   MONGODB_URI                   – MongoDB Atlas connection string

# 4. Run the dev server
npm run dev
```

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to Vercel |
| `dev`  | Staging / integration |
| `feat/*` | New features |
| `fix/*`  | Bug fixes |

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add hospital specialty filter
fix: correct ETA calculation for heavy traffic
seo: add OpenGraph metadata to layout
docs: update README setup instructions
refactor: extract map config to lib/maps-config.ts
```

## Pull Request Checklist

- [ ] Code builds successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] Responsive on mobile (min 320px)
- [ ] Emergency theme maintained (dark bg, red/orange accents)

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page |
| `app/globals.css` | Design tokens & utilities |
| `components/shared/` | Reusable UI components |
| `app/api/groq/route.ts` | AI route analysis |
| `store/useEmergencyStore.ts` | Global state |

---

> Made with ❤️ for emergency responders — every second counts.
