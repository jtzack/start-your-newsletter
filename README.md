# Start & Scale Your Newsletter — 5-Day Sprint

Sales landing page for the **Start & Scale Your Newsletter 5-Day Sprint** (live cohort: July 27–31, 2026).

Built with Vite + React + TypeScript + Tailwind CSS. Visual identity carried over from the
[waitlist page](https://github.com/jtzack/start-your-newsletter-waitlist) (near-black ink, electric-yellow accent,
Archivo + Space Mono); section structure adapted from the
[SWO Sprint page](https://github.com/jtzack/swo-sprint).

## Sections

1. Hero (countdown to cart close — Mon Jul 27, 3PM ET)
2. Why start a newsletter? And why now?
3. What is the Start & Scale Your Newsletter Sprint?
4. Meet your instructors
5. Is the sprint right for you?
6. The live sessions (5-day timeline)
7. Bonuses
8. 30-day trial to AI Writing Skool
9. Offer stack / pricing
+ Final CTA, FAQ, sticky CTA bar

## Analytics (Fathom, site `UCNVPYFA`)

- Every CTA fires `CTA: <SectionName>` (Hero, Why Now, What Is, Right For You, Sessions, Bonuses, Pricing, Final, Sticky Bar)
- FAQ expands fire `FAQ: <question>`
- Scroll-depth milestones fire `Scroll: 25|50|75|100%`

## Develop

```bash
npm install
npm run dev     # local dev server
npm run build   # production build → dist/
```

## Deploy

Deployed on Vercel. `vercel.json` rewrites all routes to `index.html` (SPA).
