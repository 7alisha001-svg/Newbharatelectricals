# Plan: Replace Hero Carousel with Single Full-Width Banner Image

## Current State
- **File**: `src/components/Hero.tsx` (183 lines)
- **Used by**: `src/pages/Home.tsx` via `<Hero />`
- **Current behavior**: 3-slide carousel with auto-advance (6s), navigation arrows, feature icons, CTAs, and right-side product images
- **Height**: `min-h-[320px] sm:min-h-[420px] md:h-[550px] lg:h-[600px]`
- **Imports**: `motion/react`, `AnimatePresence`, `useState`, `useEffect`, `react-router-dom` Link, `lucide-react` icons (10 icons), `useMedia`, `MediaImage`
- **Available banner asset**: `public/images/amaze-an-star-1475-1.jpg`

## Goal
Replace the carousel with ONE single full-width banner image while preserving:
- Exact same section position in page layout
- Same approximate visual height on desktop
- Responsive behavior (mobile/tablet/desktop)
- Existing header, navbar, footer, colors, typography, routing, and all other sections

## Implementation Steps

### Step 1: Rewrite `src/components/Hero.tsx`

Replace the entire file content with a simplified banner-only component.

**New component structure:**
```tsx
import { useMedia } from '../context/MediaContext';

export default function Hero() {
  const { getMediaUrl } = useMedia();

  return (
    <section className="relative w-full overflow-hidden bg-[#f4f4f4] border-none">
      <div className="relative w-full h-auto min-h-[320px] sm:min-h-[420px] md:h-[550px] lg:h-[600px]">
        <img
          src={getMediaUrl('hero_banner_1', '/images/amaze-an-star-1475-1.jpg')}
          alt="New Bharat Electricals - Solar & Power Solutions"
          className="w-full h-full object-cover block"
          loading="eager"
        />
      </div>
    </section>
  );
}
```

**Key changes:**
- Remove all `motion/react`, `AnimatePresence`, `useState`, `useEffect` imports
- Remove all `lucide-react` icon imports
- Remove `Link` from `react-router-dom`
- Remove `MediaImage` component wrapper (use plain `<img>` for simplicity and performance)
- Remove carousel state (`currentSlide`, `setCurrentSlide`)
- Remove `heroSlides` array
- Remove `useEffect` auto-advance timer
- Remove all left content (pre-title, title, features, CTA buttons)
- Remove right image container
- Remove navigation arrows
- Keep `useMedia` context to allow admin media library to override the banner image via `hero_banner_1` key
- Keep exact same outer `<section>` and inner `<div>` height classes to preserve layout position and proportions

### Step 2: Verify `src/pages/Home.tsx` needs no changes

`Home.tsx` currently imports and renders `<Hero />`. Since the component name and export remain the same, no changes are needed in `Home.tsx`.

### Step 3: Verify no other files import Hero

Run a quick grep to confirm `Hero` is only imported in `Home.tsx` and not in any other page/component.

### Step 4: Verify TypeScript compilation

Run `tsc --noEmit` (or equivalent project typecheck command) to ensure no TypeScript errors from the simplified component.

### Step 5: Verify build succeeds

Run the project build command (check `package.json` for the exact script) to ensure the change compiles and bundles correctly.

## Why this approach
- **Single source of truth**: One banner image path with fallback to the existing local asset
- **No broken imports**: `Home.tsx` continues to work without modification
- **Preserves layout**: Same height classes ensure the section doesn't shift
- **Responsive**: `object-cover` + `h-full` ensures the image fills the area on all screen sizes without overflow
- **Admin override support**: Still uses `getMediaUrl` so the admin can replace `hero_banner_1` in the media library to change the banner live
- **No unused dependencies**: Removes `framer-motion`, `lucide-react` icons, and `react-router-dom` Link from this component, reducing bundle size

## Risks & Mitigations
- **Risk**: `getMediaUrl` might return `undefined` if no override is set. The fallback `'/images/amaze-an-star-1475-1.jpg'` handles this.
- **Risk**: Removing `MediaImage` means losing its built-in error fallback. Plain `<img>` with a good default src is sufficient for a single banner.
- **Risk**: SEO impact from removing H1 text. If SEO is critical, consider adding an H1 off-screen or as `alt` text. **Recommendation**: Keep the descriptive `alt` text; do NOT add hidden H1 unless explicitly requested, as the user asked to remove hero contents.
