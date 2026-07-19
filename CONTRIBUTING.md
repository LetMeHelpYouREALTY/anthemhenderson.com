# Contributing to HeyBerkshire.com

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/DrJanDuffy/heyberkshire.com.git
cd heyberkshire.com

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Project Structure

```
heyberkshire.com/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── calendly/          # Calendly widget integration
│   ├── chat/              # AI chat widget
│   ├── layouts/           # Navbar, Footer
│   ├── realscout/         # RealScout MLS widgets
│   ├── sections/          # Page sections (Hero, CTA, etc.)
│   └── ui/                # UI primitives (Button, Input)
├── lib/                   # Utilities and constants
├── public/                # Static assets
│   ├── images/            # Image assets (organized by type)
│   └── videos/            # Video assets
└── .cursor/rules/         # Cursor AI rules
```

## Code Standards

### TypeScript
- Use strict mode
- Define types for all props
- Prefer interfaces over types for objects

### Components
- Functional components only
- Use `"use client"` only when needed
- Keep components under 200 lines

### Styling
- Tailwind CSS utility classes
- Use `cn()` helper for conditional classes
- Mobile-first responsive design

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `content/description` - Content updates

### Commit Messages
Use clear, descriptive messages:
```
feat: Add neighborhood page for Summerlin
fix: Resolve Calendly widget not loading
content: Update FAQ section
```

### Pull Requests
1. Create feature branch from `main`
2. Make changes and test locally
3. Push and create PR
4. Fill out PR template
5. Request review

## Adding Media Assets

### Images
- Place in appropriate `/public/images/` subfolder
- Use WebP format when possible
- Optimize before committing (<200KB)
- See `/public/images/README.md` for specs

### Videos
- Place in `/public/videos/`
- Use MP4 (H.264) format
- Keep hero videos under 5MB
- See `/public/videos/README.md` for specs

## Widget Integration

### RealScout
Script loaded globally in layout. Use `dangerouslySetInnerHTML` for widgets.
See `.cursor/rules/` for patterns.

### Calendly
Script loaded globally with `afterInteractive` strategy.
Use `Calendly.initInlineWidget()` API.
See `.cursor/rules/calendly-widget-integration.mdc`.

## Testing Locally

```bash
# Type check
pnpm type-check

# Build for production
pnpm build

# Preview production build
pnpm start
```

## Deployment

Automatic deployments via Vercel:
- Push to `main` → Production deploy
- Push to feature branch → Preview deploy

## Need Help?

- Check existing `.cursor/rules/` for patterns
- Review component examples in `/components/`
- Contact project maintainer
