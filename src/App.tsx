import './index.css'
import { useState, useEffect, useRef } from 'react'
import * as Fathom from 'fathom-client'

const CTA_URL = 'https://ship.samcart.com/products/start-your-newsletter-sprint?coupon=ACTION100'

// Cart closes the moment Day 1 kicks off: Monday, July 27, 2026, 3PM ET
const CART_CLOSE_DATE = new Date('2026-07-27T19:00:00Z')

const trackCTA = (location: string) => Fathom.trackEvent(`CTA: ${location}`)

/* ─── Fade-up on scroll ─── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      opacity: visible ? 1 : 0,
      transition: `transform 320ms ease-out ${delay}ms, opacity 320ms ease ${delay}ms`,
    }}>{children}</div>
  )
}

/* ─── Logo lockup — 📬 emoji + wordmark ─── */
function Logo({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span style={{ fontSize: size * 1.2, lineHeight: 1 }} role="img" aria-label="mailbox">📬</span>
      <span className="font-extrabold text-paper tracking-[-0.01em] leading-none uppercase" style={{ fontSize: size }}>
        Start &amp; Scale Your Newsletter
      </span>
    </div>
  )
}

/* ─── Eyebrow — Space Mono, yellow, tracked caps (waitlist badge DNA) ─── */
function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono font-bold text-[12px] uppercase tracking-caps text-accent ${className}`}>
      {children}
    </p>
  )
}

/* ─── Yellow CTA (the page's heartbeat) ─── */
function CTA({
  children,
  href = CTA_URL,
  size = 'lg',
  variant = 'solid',
  full = false,
  className = '',
  onRef,
  track,
}: {
  children: React.ReactNode
  href?: string
  size?: 'lg' | 'sm'
  variant?: 'solid' | 'dark'
  full?: boolean
  className?: string
  onRef?: React.Ref<HTMLAnchorElement>
  track?: string
}) {
  const pad = size === 'lg' ? 'px-9 py-[18px] text-[clamp(15px,1.35vw,18px)]' : 'px-6 py-3 text-[14px]'
  const variantClass = {
    solid: 'bg-accent text-ink shadow-cta hover:brightness-[1.08]',
    dark: 'bg-ink text-accent border border-accent/40 hover:bg-card-2',
  }[variant]
  return (
    <a
      ref={onRef}
      href={href}
      onClick={() => track && trackCTA(track)}
      className={`${full ? 'block w-full text-center' : 'inline-block'} font-extrabold uppercase tracking-[0.02em] rounded-btn transition-[transform,filter] duration-150 active:scale-[0.98] hover:-translate-y-[2px] ${pad} ${variantClass} ${className}`}
    >
      {children}
    </a>
  )
}

/* ─── Countdown Timer ─── */
function CountdownTimer({ targetDate, compact, hero }: { targetDate: Date; compact?: boolean; hero?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = targetDate.getTime() - new Date().getTime()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    const id = setInterval(() => setTimeLeft(calc()), 1000)
    setTimeLeft(calc())
    return () => clearInterval(id)
  }, [targetDate])

  if (compact) {
    return (
      <span className="font-mono text-[13px] text-fg-2 tabular-nums font-bold">
        {String(timeLeft.days).padStart(2, '0')}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    )
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ]

  if (hero) {
    return (
      <div className="sprint-countdown">
        {units.map((u) => (
          <div key={u.label} className="cd-unit">
            <div className="cd-box">{String(u.value).padStart(2, '0')}</div>
            <span>{u.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="inline-flex gap-3">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className="font-extrabold text-[28px] leading-none rounded-btn px-3 py-2 min-w-[54px] text-center tabular-nums bg-card-2 text-accent">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-caps mt-1.5 text-fg-3">{u.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   1. HERO — waitlist DNA: marker-highlight headline, yellow CTA
   ═══════════════════════════════════════════════════════════ */

/* The roadmap track — a closed loop traced through the five yellow session
   stops (percent coordinates measured from the poster art). A tracer dot
   laps the route continuously; each stop flashes as the dot passes it
   (delays = each stop's arc-length fraction of the lap). */
const TRACK_PATH = 'M 54.4 10.7 C 59.7 8.7, 62.3 23.8, 65.1 32.8 C 67.9 41.8, 76.9 56.8, 71.3 65.0 C 65.7 73.2, 37.6 85.1, 31.3 81.8 C 25.0 78.5, 29.4 56.8, 33.3 44.9 C 37.1 33.0, 49.1 12.7, 54.4 10.7 Z'
const TRACK_DUR = 16 // seconds per lap
const ROAD_STOPS = [
  { x: 54.4, y: 10.7, t: 0.0 },
  { x: 65.1, y: 32.8, t: 0.142 * TRACK_DUR },
  { x: 71.3, y: 65.0, t: 0.326 * TRACK_DUR },
  { x: 31.3, y: 81.8, t: 0.57 * TRACK_DUR },
  { x: 33.3, y: 44.9, t: 0.779 * TRACK_DUR },
]

function HeroRoadmap() {
  return (
    <div className="hero-roadmap" aria-hidden="true">
      <div className="hr-box">
        <img src="/images/roadmap.webp" alt="" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="hr-track" d={TRACK_PATH} />
          {ROAD_STOPS.map((s, i) => (
            <circle key={i} className="hr-pulse" cx={s.x} cy={s.y} r="2.4" style={{ animationDelay: `${s.t.toFixed(2)}s` }} />
          ))}
          <circle className="hr-tracer" r="1.1" cx="0" cy="0" style={{ offsetPath: `path('${TRACK_PATH}')` }} />
        </svg>
      </div>
    </div>
  )
}

function Hero({ ctaRef }: { ctaRef: React.RefObject<HTMLAnchorElement | null> }) {
  return (
    <header className="relative isolate overflow-hidden flex items-center justify-center min-h-screen bg-ink">
      <div className="hero-glow" aria-hidden="true" />
      <HeroRoadmap />
      <div className="hero-vignette" aria-hidden="true" />

      <div className="hero-content relative z-[2] w-full max-w-[960px] mx-auto px-5 md:px-8 py-10 md:py-14 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2.5 border border-accent/40 bg-accent-soft rounded-full px-4 py-2 font-mono text-[12px] font-bold uppercase tracking-caps text-accent">
          <span className="pulse-dot w-2 h-2 rounded-full bg-accent flex-shrink-0" />
          Live Sprint Begins Monday, July 27
        </div>

        <h1
          className="font-black text-paper uppercase mt-6"
          style={{ fontSize: 'clamp(32px, 4.6vw, 64px)', lineHeight: 0.98, letterSpacing: '-0.01em', textWrap: 'balance' as React.CSSProperties['textWrap'] }}
        >
          Build A <span className="hl">6&#8209;Figure Newsletter</span> From Scratch{' '}
          <span className="text-accent italic normal-case">in just 5 days</span>
        </h1>

        <p className="text-fg-2 max-w-[620px] mt-5" style={{ fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.55 }}>
          A 1-week live experience to help you <strong className="text-paper font-bold">start your newsletter</strong>, position
          it as the &ldquo;category king&rdquo; of your niche, and start{' '}
          <strong className="text-paper font-bold">growing (and monetizing)</strong> it — in 5 days.
        </p>

        <a
          ref={ctaRef}
          href={CTA_URL}
          onClick={() => trackCTA('Hero')}
          className="cta-glow inline-flex items-center justify-center mt-7 font-extrabold uppercase text-[16px] tracking-[0.02em] text-ink bg-accent rounded-btn px-10 py-[18px] transition-[transform,filter] duration-150 hover:brightness-[1.08] active:scale-[0.98]"
        >
          Join The Sprint
        </a>

        <div className="flex flex-col items-center gap-y-2 sm:flex-row sm:flex-wrap sm:justify-center gap-x-3 mt-5 text-[15px] font-semibold text-fg-1">
          <span className="inline-flex items-center gap-0.5 text-accent" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 20 20" className="w-[18px] h-[18px]" fill="currentColor">
                <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
              </svg>
            ))}
          </span>
          <span>Join 10,000+ writers we&rsquo;ve taught</span>
          <img
            src="/images/s30-people.webp"
            alt="Recent sprint students"
            loading="lazy"
            className="h-7 w-auto rounded-[6px]"
          />
        </div>

        <p className="font-mono text-[11px] font-bold uppercase text-fg-3 mt-8 md:mt-10 mb-4" style={{ letterSpacing: '0.22em' }}>Cart Closes In</p>
        <CountdownTimer targetDate={CART_CLOSE_DATE} hero />
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════
   2. WHY START A NEWSLETTER? AND WHY NOW?
   ═══════════════════════════════════════════════════════════ */
function WhyNewsletter() {
  const reasons = [
    { num: '01', title: 'You Own Your Email List', body: 'Social followers are rented from an algorithm. Your email list is the only audience no platform, employer, or algorithm change can take away from you. You can’t put likes in the bank — but you can monetize a list you own, forever.' },
    { num: '02', title: 'Newsletters Print Money (Without Ads)', body: 'Ben Thompson’s Stratechery makes $5M+/year from subscriptions. Justin Welsh has driven $6M+ in sales from his list. Paid subscriptions, books, and digital products — a newsletter is the nucleus of a real digital business.' },
    { num: '03', title: 'There’s Never Been A Better Time', body: 'AI now does the heavy lifting of drafting (once it’s trained on YOUR style), and discovery engines like Substack Recommendations and Notes hand new writers free subscribers. Early adopters win — and it’s still early.' },
  ]
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <Eyebrow className="mb-3">The opportunity</Eyebrow>
        <h2 className="font-extrabold text-paper uppercase tracking-display mb-12 max-w-[18ch]" style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.02 }}>
          Why start a newsletter? And why <span className="hl normal-case italic font-black">now</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div key={r.num} className="bg-card-2 border border-line rounded-card p-7 md:p-8 flex flex-col">
              <p className="font-mono font-bold text-[40px] leading-none text-accent mb-4">{r.num}</p>
              <h3 className="font-bold text-[22px] text-paper mb-3">{r.title}</h3>
              <p className="text-[16px] leading-[1.6] text-fg-2">{r.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <CTA size="lg" track="Why Now">Join The Sprint</CTA>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   3. WHAT IS THE SPRINT — stat cards + roadmap art
   ═══════════════════════════════════════════════════════════ */
function WhatIsTheSprint() {
  const stats = [
    { num: '5', label: 'Live Sessions', desc: 'One per day, Mon–Fri. 3PM ET / Noon PT. Live on Zoom, replays forever.' },
    { num: '5', label: 'Days To Launch Your Newsletter', desc: 'From no name and no niche to a positioned, published, growing newsletter.' },
    { num: '5', label: 'Done-For-You AI Prompts', desc: 'A plug-and-play AI prompt included with every single session.' },
    { num: '2', label: 'World-Class Instructors', desc: 'Nicolas Cole & Dickie Bush — founders of Ship 30 for 30.' },
  ]
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <Eyebrow className="mb-4">The sprint</Eyebrow>
          <h2 className="font-extrabold text-paper uppercase tracking-display max-w-[20ch]" style={{ fontSize: 'clamp(30px, 4.6vw, 52px)', lineHeight: 1.05 }}>
            What is the Start &amp; Scale Your Newsletter Sprint?
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
            <img
              src="/images/roadmap.webp"
              alt="The sprint roadmap: category positioning, choosing your platform, writing mastery, traffic secrets, and monetization."
              className="w-full max-w-[520px] object-contain"
              loading="lazy"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card-2 border border-line rounded-card p-5 md:p-6 flex flex-col">
                <p className="font-black text-accent leading-none mb-3" style={{ fontSize: 'clamp(40px, 4vw, 56px)' }}>{s.num}</p>
                <p className="text-[13px] font-bold text-paper mb-2 leading-tight uppercase tracking-[0.06em]">{s.label}</p>
                <p className="text-[13px] md:text-[14px] leading-[1.5] text-fg-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 text-center">
          <CTA size="lg" track="What Is">Join The Sprint</CTA>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   4. MEET YOUR INSTRUCTORS
   ═══════════════════════════════════════════════════════════ */
function Instructors() {
  const captains = [
    {
      name: 'Nicolas Cole',
      role: 'Co-Founder, Ship 30 for 30 & Write With AI',
      img: '/images/cole-headshot.webp',
      bio: 'I became the #1 most-read writer on Quora, turned that into a column at Inc Magazine and a multimillion-dollar ghostwriting agency, and co-built Category Pirates — a multi-6-figure paid newsletter whose republished “mini-books” added another $150,000+ per year from Amazon alone. Everything I know about positioning and monetizing newsletters is in this sprint.',
    },
    {
      name: 'Dickie Bush',
      role: 'Co-Founder, Ship 30 for 30',
      img: '/images/dickie-headshot.webp',
      bio: 'I started writing online in January 2020 and turned a 30-day experiment into Ship 30 for 30 — the internet’s #1 writing program. Together with Cole, I’ve used email and newsletter writing to generate over $20,000,000 across our portfolio of digital writing businesses, including the #1 paid education newsletter on all of Substack.',
    },
  ]
  const pills = ['10,000+ Writers Taught', '$20M+ Generated “Sending Emails”', '#1 Paid Education Newsletter On Substack']
  return (
    <section id="instructors" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-start">
        <div>
          <Eyebrow className="mb-5">Meet your instructors</Eyebrow>
          <h2 className="font-extrabold text-paper uppercase tracking-display mb-6" style={{ fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.06 }}>
            Built by the founders of the internet&rsquo;s #1 writing program.
          </h2>
          <p className="text-[17px] text-fg-2 leading-[1.6] max-w-[520px] mb-8">
            Created by Nicolas Cole &amp; Dickie Bush — the team behind <strong className="text-paper font-semibold">Ship 30 for 30</strong>,
            the program that&rsquo;s taught over 10,000 writers to start writing online.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {pills.map((s) => (
              <span key={s} className="inline-flex items-center bg-card-3 border border-line text-paper font-mono text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-2 rounded-card">{s}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {captains.map((c) => (
            <div key={c.name} className="bg-card-2 border border-line rounded-card p-6 md:p-7 flex gap-5 items-start">
              <div className="w-[80px] h-[80px] md:w-[92px] md:h-[92px] rounded-full overflow-hidden flex-shrink-0 border-2 border-accent/50">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <div>
                <p className="font-extrabold text-[20px] text-accent leading-none">{c.name}</p>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-fg-3 mt-2 mb-3">{c.role}</p>
                <p className="text-[15px] leading-[1.6] text-fg-2">{c.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   4B. OUR NEWSLETTERS — PROOF
   ═══════════════════════════════════════════════════════════ */
function NewsletterProof() {
  const newsletters = [
    {
      name: 'Category Pirates',
      img: '/images/category-pirates.png',
      points: [
        'The leading newsletter on Category Design',
        'Top 10 Business Newsletter on Substack',
        '30,000+ free subscribers',
        '$150,000+ per year in paid subscriptions',
        'The engine of a 7+ figure digital product & consulting business',
      ],
    },
    {
      name: 'Write With AI',
      img: '/images/write-with-ai.png',
      points: [
        'The leading newsletter on Writing With AI',
        'Top 5 Education Newsletter on Substack',
        '50,000+ free subscribers',
        '$300,000+ per year in paid subscriptions',
        'The engine of a 7+ figure digital product business',
      ],
    },
    {
      name: 'Start Writing Online',
      img: '/images/start-writing-online.png',
      points: [
        'The leading newsletter on how to Start Writing Online',
        '100,000+ free subscribers',
        'The engine of Ship 30 for 30, the fastest-growing writing program on the Internet',
      ],
    },
    {
      name: 'Start Ghostwriting',
      img: '/images/start-ghostwriting.png',
      points: [
        'The leading newsletter on how to Start Ghostwriting',
        '100,000+ free subscribers',
        'The engine of Premium Ghostwriting Academy, the leading ghostwriting training program on the Internet and 8-figure business',
      ],
    },
  ]
  return (
    <section id="proof" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <div className="text-center mb-12">
          <Eyebrow className="mb-4">Our newsletters</Eyebrow>
          <h2 className="font-extrabold text-paper uppercase tracking-display mx-auto max-w-[24ch]" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.05 }}>
            Proof we know what we&rsquo;re talking about!
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {newsletters.map((n) => (
            <div key={n.name} className="bg-card-2 border border-line rounded-card p-6 md:p-7 flex gap-5 md:gap-6 items-start">
              <img
                src={n.img}
                alt={`The ${n.name} newsletter`}
                loading="lazy"
                className="w-[104px] md:w-[150px] h-auto flex-shrink-0 rounded-[10px] border border-line bg-white"
              />
              <div className="min-w-0">
                <p className="font-extrabold text-[22px] text-accent leading-none mb-5">{n.name}</p>
                <ul className="flex flex-col gap-3">
                  {n.points.map((p) => (
                    <li key={p} className="flex gap-3 items-start">
                      <Check />
                      <span className="text-[15px] leading-[1.55] text-fg-2 pt-0.5">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-card-2 border border-line rounded-card overflow-hidden grid lg:grid-cols-2 items-center">
          <div className="p-7 md:p-10">
            <p className="font-extrabold text-[24px] md:text-[28px] text-paper leading-tight mb-4">
              And it&rsquo;s not just <em className="text-accent not-italic">our</em> newsletters.
            </p>
            <p className="text-[16px] text-fg-2 leading-[1.6] max-w-[440px]">
              Writers inside our programs use this exact playbook to launch and grow their own newsletters —
              here&rsquo;s a small sample of their wins.
            </p>
          </div>
          <div className="p-5 md:p-8">
            <img src="/images/syn-social-proof.png" alt="Screenshots of students sharing newsletter launches, first sales, and subscriber milestones" className="w-full h-auto" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Yellow circled check ─── */
function Check() {
  return (
    <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 bg-accent-soft">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#E9EF3A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   5. IS THE SPRINT RIGHT FOR YOU?
   ═══════════════════════════════════════════════════════════ */
function RightForYou() {
  const cards = [
    { title: 'Have you wanted to <em>start a newsletter</em>, but never pulled the trigger?', body: 'Are you <strong>overwhelmed</strong> deciding between Kit, Beehiiv, and Substack — or stuck on what to even call your newsletter?' },
    { title: 'Have you <em>started a newsletter</em>, but stalled out?', body: 'Are you <strong>publishing into the void</strong> — no growth, no engagement, wondering why nobody subscribes? (35% of newsletters never make it to issue #2.)' },
    { title: 'Do you have an <em>audience or expertise</em>, but no email list?', body: 'Are you building on <strong>rented land</strong> — social followers you don’t own — with no way to monetize the attention you’ve earned?' },
  ]
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <h2 className="font-extrabold text-paper uppercase tracking-display text-center mb-12 md:mb-14" style={{ fontSize: 'clamp(28px, 4.2vw, 48px)', lineHeight: 1.05 }}>
          Is the sprint right for you?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <div key={i} className="bg-card-2 border border-line rounded-card p-6 md:p-7 flex flex-col gap-4">
              <Check />
              <h3
                className="font-bold text-[19px] leading-[1.3] text-paper [&_em]:not-italic [&_em]:text-accent"
                dangerouslySetInnerHTML={{ __html: c.title }}
              />
              <p
                className="text-[15px] leading-[1.55] text-fg-2 [&_strong]:text-paper [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: c.body }}
              />
            </div>
          ))}
        </div>
        <div className="text-center my-14 md:my-16">
          <p className="font-extrabold text-paper uppercase tracking-tight2 mb-4" style={{ fontSize: 'clamp(26px, 3.6vw, 44px)', lineHeight: 1.08 }}>If any of these sound familiar&hellip;</p>
          <p className="font-extrabold text-paper uppercase tracking-tight2" style={{ fontSize: 'clamp(26px, 3.6vw, 44px)', lineHeight: 1.08 }}>
            The <span className="hl">Start &amp; Scale Your Newsletter Sprint</span> was built for you.
          </p>
        </div>
        <div className="text-center">
          <CTA size="lg" track="Right For You">Join The Sprint</CTA>
        </div>
      </div>
    </section>
  )
}

/* ─── Hairline section rule ─── */
function Divider() {
  return <div className="max-w-[1000px] mx-auto h-[2px] bg-accent/60" />
}

/* ═══════════════════════════════════════════════════════════
   6. THE LIVE SESSIONS — 5 days on a vertical timeline
   ═══════════════════════════════════════════════════════════ */
function LiveSessions() {
  const sessions = [
    { num: 1, icon: '/images/session-1.webp', date: 'Mon Jul 27', title: 'Category Newsletter Positioning', desc: 'How to name your newsletter so you’re seen as the “category king” of your niche, positioned as a thought leader, and differentiated from all competition. Positioning dictates 80%+ of your newsletter’s success — we nail it on Day 1.', asset: 'Newsletter Name Generator' },
    { num: 2, icon: '/images/session-2.webp', date: 'Tue Jul 28', title: 'Choose Your Newsletter Platform', desc: 'Kit vs. Beehiiv vs. Substack — the real pricing math in 2026 (including the fees nobody puts on their pricing page), how each discovery engine works, and the one question that makes the decision 10X easier. Pick your platform TODAY and never think about it again.', asset: 'Platform Decision Framework' },
    { num: 3, icon: '/images/session-3.webp', date: 'Wed Jul 29', title: 'Newsletter Writing Mastery', desc: 'How to write “the perfect newsletter” in 60 minutes or less — subject lines readers can’t ignore, a modular “writing is like playing with Legos” system, and how to train AI on YOUR writing style so drafts sound like you, not a robot.', asset: 'Voice Template + Weekly Newsletter Writer Prompt' },
    { num: 4, icon: '/images/session-4.webp', date: 'Thu Jul 30', title: 'Newsletter Traffic Secrets', desc: 'You never have to “create social content” again. Extract 10+ social posts from every newsletter you write and drive organic traffic from X, LinkedIn, and Substack Notes to acquire subscribers for $0 — with a 20-minute daily system.', asset: 'Newsletter-to-Social Repurposer Prompt' },
    { num: 5, icon: '/images/session-5.webp', date: 'Fri Jul 31', title: 'Newsletter Monetization Methods', desc: 'The 3 best ways to monetize without ads: Paid Newsletters, Books, and Digital Products. Plus the decision framework for which to launch first — and your 90-day monetization plan.', asset: 'Monetization Roadmap Prompt' },
  ]
  return (
    <section id="sessions" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-narrow mx-auto">
        <Eyebrow className="mb-3 text-center">The 5 live sessions</Eyebrow>
        <h2 className="font-extrabold text-paper uppercase tracking-display text-center mb-3" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.05 }}>
          Here&rsquo;s what you&rsquo;ll build.
        </h2>
        <p className="font-mono text-[13px] text-fg-2 text-center mb-14">
          All sessions live on Zoom &middot; Mon&ndash;Fri &middot; 3PM ET / Noon PT &middot; July 27&ndash;31, 2026
        </p>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-accent/25" />
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-[2px] bg-accent/25" />

          <div className="space-y-10 md:space-y-14">
            {sessions.map((s) => {
              const isEven = s.num % 2 === 0
              return (
                <div key={s.num} className="relative">
                  <div className="absolute z-10 w-[60px] h-[60px] rounded-full bg-card-2 border-2 border-accent flex items-center justify-center -left-[9px] md:left-1/2 translate-x-0 md:-translate-x-1/2 shadow-cta">
                    <img src={s.icon} alt="" loading="lazy" className="h-8 w-auto object-contain" />
                  </div>
                  <div className={`pl-16 md:pl-0 md:w-[45%] ${isEven ? 'md:ml-auto md:pl-14' : 'md:mr-auto md:pr-14 md:text-right'}`}>
                    <span className="inline-block bg-card-2 border border-line text-accent font-mono text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-[6px] mb-2.5">Day {s.num} · {s.date}</span>
                    <h3 className="font-bold text-paper mb-2.5" style={{ fontSize: 'clamp(22px, 2.6vw, 28px)' }}>{s.title}</h3>
                    <p className="text-[15px] text-fg-2 leading-[1.6] mb-3">{s.desc}</p>
                    <div className={`inline-block bg-card-2 border border-line rounded-[8px] px-3 py-2 ${isEven ? '' : 'md:ml-auto'}`}>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-accent mb-0.5">AI Prompt included</p>
                      <p className="text-[13px] font-semibold text-paper">{s.asset}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="font-extrabold text-paper uppercase tracking-tight2 mb-5" style={{ fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 1.12 }}>
            We build <span className="hl">together</span>. You leave with a <span className="hl">launched newsletter</span>.
          </p>
          <p className="text-[16px] text-fg-2 mb-8">Every session comes with step-by-step actions, done-for-you templates, AI prompts, and replays you keep forever.</p>
          <CTA size="lg" track="Sessions">Join The Sprint</CTA>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   7. BONUSES
   ═══════════════════════════════════════════════════════════ */
function BonusSection() {
  const bonuses = [
    { tag: 'Bonus #1', title: 'Subject Line Swipe File', desc: 'How to write irresistible subject lines with AI — plus the 5 golden rules to follow for every email that almost guarantee your newsletter gets opened.', value: '$199', icon: '/images/bonus-subject-lines.webp' },
    { tag: 'Bonus #2', title: 'Newsletter Opening Hooks', desc: 'The exact prompt we use to generate strong opening hooks for emails and posts. Give it your topic and it produces multiple hook angles designed to stop readers and make them keep reading.', value: '$99', icon: '/images/bonus-hooks.webp' },
    { tag: 'Bonus #3', title: '30-Day Free Trial To Ghostbase', desc: 'Ghostbase is a custom AI model trained on Nicolas Cole’s library of content (well over a billion views) and a decade of writing experience. Just describe what you want to write and it generates premium content that sounds like you, built for LinkedIn.', value: '$99', icon: '/images/bonus-ghostbase.webp' },
  ]
  return (
    <section id="bonuses" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <Eyebrow className="mb-4">Plus free bonuses</Eyebrow>
          <h2 className="font-extrabold text-paper uppercase tracking-display max-w-[18ch]" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.05 }}>
            Enroll today and unlock these bonuses.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bonuses.map((b) => (
            <div key={b.tag} className="bg-card-2 rounded-card p-7 flex flex-col border border-line">
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="inline-block bg-card-3 text-accent font-mono text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-[6px]">{b.tag}</span>
                <div className="h-16 flex-shrink-0 flex items-center justify-end">
                  <img src={b.icon} alt="" className="h-full w-auto object-contain" loading="lazy" />
                </div>
              </div>
              <h3 className="font-bold text-[20px] text-paper mb-3">{b.title}</h3>
              <p className="text-[15px] leading-[1.6] text-fg-2 flex-1">{b.desc}</p>
              <p className="font-mono text-[13px] text-accent font-bold mt-4">({b.value} value)</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <CTA size="lg" track="Bonuses">Join The Sprint</CTA>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   8. AI WRITING SKOOL — Free 30-Day Trial
   ═══════════════════════════════════════════════════════════ */
function AIWritingSkool() {
  const perks = [
    { title: 'AI Cole', desc: 'Our custom AI model trained on all of our programs, curriculums, books, and content. Ask it anything, 24/7.', value: '$5,000+ value' },
    { title: 'Monday Hot Seats with Cole', desc: 'Submit your questions and workshop your newsletter live.', value: '$3,000+ value' },
    { title: 'Weekly AI/Tech Clinic with Mitch Harris', desc: 'Office hours to troubleshoot, learn new AI tools, and stay on the cutting edge.', value: '$1,500+ value' },
    { title: 'Monthly Mini-Products, Templates, Prompts, and .Skills', desc: 'New resources dropped every month that you can download and use immediately.', value: '$1,000+ value' },
  ]
  return (
    <section className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-container mx-auto">
        <Eyebrow className="mb-4">Included free with the sprint</Eyebrow>
        <h2 className="font-extrabold text-paper uppercase tracking-display mb-4" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.05 }}>
          A 30-day trial to <span className="hl">AI Writing Skool</span>.
        </h2>
        <p className="text-[18px] text-fg-2 mb-12 max-w-[760px] leading-[1.6]">
          AI Writing Skool is THE community for writers and creators building in the new AI economy — and you get full
          access for 30 days so you can <strong className="text-paper font-semibold">get feedback on your newsletter</strong>,
          trade growth tactics, and stay sharp as you build.
        </p>
        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start">
          <div className="w-full md:w-[45%] flex-shrink-0">
            <img src="/images/AIWS.webp" alt="AI Writing Skool" className="w-full object-contain rounded-card border border-line shadow-card" loading="lazy" />
          </div>
          <div className="flex-1">
            <Eyebrow className="mb-5">Inside, you&rsquo;ll unlock:</Eyebrow>
            <div className="space-y-5">
              {perks.map((p) => (
                <div key={p.title} className="flex gap-3">
                  <span className="text-accent mt-1 flex-shrink-0 font-bold">→</span>
                  <div>
                    <span className="text-[15px] font-bold text-paper">{p.title}:</span>
                    <span className="text-[15px] text-fg-2"> {p.desc}</span>
                    <span className="font-mono text-[13px] text-accent font-bold"> ({p.value})</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <span className="text-accent mt-1 flex-shrink-0 font-bold">→</span>
                <div>
                  <span className="text-[15px] font-bold text-paper">Daily Q&amp;A Channel:</span>
                  <span className="text-[15px] text-fg-2"> Never get stuck. Get answers from the community and our team every single day.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   9. OFFER STACK / PRICING
   ═══════════════════════════════════════════════════════════ */
function Pricing() {
  const items = [
    { name: 'The Start Your Newsletter Sprint Curriculum', price: '$500' },
    { name: '5 x Live Sessions (Mon–Fri, 3PM ET)', price: '$1,500' },
    { name: 'The Sprint Session Guide', price: '$300' },
    { name: 'Done-For-You AI Prompts & Templates', price: '$500' },
    { name: 'Lifetime Access to the Curriculum', price: 'Priceless' },
    { name: '30-Day AI Writing Skool Trial', price: '$99' },
    { name: 'BONUS: Subject Line Swipe File', price: '$199' },
    { name: 'BONUS: Newsletter Opening Hooks', price: '$99' },
    { name: 'BONUS: 30-Day Free Trial To Ghostbase', price: '$99' },
  ]
  return (
    <section id="pricing" className="py-24 md:py-32 px-5 md:px-8">
      <div className="max-w-narrow mx-auto text-center">
        <Eyebrow className="mb-4">Join the sprint</Eyebrow>
        <h2 className="font-extrabold text-paper uppercase tracking-display mb-12 mx-auto max-w-[18ch]" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.05 }}>
          Want to start &amp; scale your newsletter in 5 days?
        </h2>

        <div className="max-w-[560px] mx-auto rounded-lg2 overflow-hidden shadow-float border border-line">
          {/* Value stack */}
          <div className="bg-card p-7 md:p-9 text-left">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2.5 border-b border-line last:border-b-0 gap-4">
                <span className="text-[14px] text-fg-1">{item.name}</span>
                <span className="font-mono text-[13px] font-bold text-fg-3 flex-shrink-0">{item.price}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 mt-3 border-t border-line">
              <span className="text-[14px] font-bold text-paper uppercase tracking-[0.06em]">Total Value</span>
              <span className="font-black text-[24px] text-paper line-through decoration-accent decoration-2">$3,296</span>
            </div>
          </div>
          {/* Price reveal — yellow panel */}
          <div className="bg-accent p-8 md:p-10 text-center">
            <p className="font-mono text-[11px] font-bold uppercase tracking-caps text-ink/60">Your price today</p>
            <div className="flex items-baseline justify-center gap-3 mt-2">
              <span className="font-black text-ink/40 leading-none line-through decoration-2" style={{ fontSize: 'clamp(32px,5.5vw,48px)' }}>$199</span>
              <span className="font-black text-ink leading-none" style={{ fontSize: 'clamp(64px,11vw,96px)' }}>$99</span>
            </div>
            <a
              href={CTA_URL}
              onClick={() => trackCTA('Pricing')}
              className="inline-block bg-ink text-accent font-extrabold uppercase text-[16px] tracking-[0.02em] px-9 py-[18px] rounded-btn mt-6 transition-[transform,filter] duration-150 hover:brightness-125 active:scale-[0.98]"
            >
              Join The Sprint →
            </a>
          </div>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-caps text-fg-3 mt-10 mb-3">Enrollment closes in</p>
        <div className="inline-block"><CountdownTimer targetDate={CART_CLOSE_DATE} /></div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FINAL CTA BAND
   ═══════════════════════════════════════════════════════════ */
function CTABand() {
  return (
    <section id="final-cta" className="py-24 md:py-32 px-5 md:px-8 text-center">
      <div className="max-w-narrow mx-auto">
        <h2 className="font-extrabold text-paper uppercase tracking-display mb-5 mx-auto" style={{ fontSize: 'clamp(34px, 5.2vw, 60px)', lineHeight: 1.05, textWrap: 'balance' as React.CSSProperties['textWrap'] }}>
          <span className="hl">Position. Publish. Profit.</span>
        </h2>
        <p className="text-[19px] text-fg-2 max-w-[620px] mx-auto mb-9 leading-[1.6]">
          Five live sessions, five done-for-you AI prompts, and a 5-day schedule that takes you from &ldquo;I should start
          a newsletter&rdquo; to a named, positioned, published newsletter with a growth engine and a monetization plan.
        </p>
        <CTA size="lg" track="Final">Join The Sprint</CTA>
        <p className="text-[14px] text-fg-3 mt-6">Live sprint begins Monday, July 27, 2026.</p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════ */
function FAQ() {
  const faqs = [
    { q: 'How much time do I need?', a: 'One 60-minute live session per day (Monday–Friday at 3PM ET / Noon PT), plus 30–60 minutes to complete each day’s homework. Everything is built during the week itself — by Friday your newsletter is live.' },
    { q: 'What if I can’t attend live?', a: 'Every session is recorded and the replay goes up within hours — and replays are yours forever. Showing up live is where the real value is (real-time Q&A and feedback), but you won’t fall behind if you miss a day.' },
    { q: 'I’ve never started a newsletter before. Will this work for me?', a: 'YES — the sprint is built for beginners. You don’t need an audience, a niche, or a name yet. Day 1 gives you positioning, Day 2 gives you the platform, Day 3 gives you your first issue. Total beginners are actually at an advantage: you won’t have to unlearn bad habits.' },
    { q: 'I already have a newsletter. Is this still useful?', a: 'The sprint works just as well if you’ve been publishing for a while and stalled. You’ll audit what’s not landing, fix your niche and positioning, plug in the $0 traffic engine, and leave with a monetization plan.' },
    { q: 'Which platform will we use — Kit, Beehiiv, or Substack?', a: 'Your choice — Day 2 is an entire session on exactly this decision, including the real 2026 pricing math and a framework that makes the choice 10X easier. Everything else in the sprint is platform-agnostic.' },
    { q: 'How long do I have access?', a: 'Lifetime. Every replay, template, and AI prompt is yours forever — including every update we ship to the curriculum.' },
    { q: 'How is this different than Category Newsletter Creator?', a: 'In this 5-day sprint, we are going to cover everything you need to start & scale a newsletter. But, there are all kinds of other things you can do to market and grow your newsletter, including building advanced sequences, stacking monetization methods on top of each other, etc. Which is what we cover inside Category Newsletter Creator.' },
    { q: 'Is there a guarantee?', a: 'We provide a tremendous amount of free education on the internet for writers. If you’re hesitant as to whether this Sprint is for you, consume some of our free stuff first. All sales are final.' },
  ]
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-narrow mx-auto">
        <Eyebrow className="mb-4">Frequently asked questions</Eyebrow>
        <h2 className="font-extrabold text-paper uppercase tracking-display mb-12" style={{ fontSize: 'clamp(30px, 4.4vw, 50px)', lineHeight: 1.05 }}>Still wondering?</h2>
        <div className="flex flex-col gap-[2px] bg-line rounded-card overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="bg-ink-900">
                <button
                  onClick={() => {
                    if (!isOpen) Fathom.trackEvent(`FAQ: ${faq.q}`)
                    setOpen(isOpen ? null : i)
                  }}
                  className="w-full bg-transparent border-none cursor-pointer px-6 md:px-7 py-5 md:py-6 flex items-center justify-between text-left text-paper text-[16px] md:text-[18px] font-semibold leading-tight hover:text-accent transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className="font-black text-[28px] text-accent leading-none flex-shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                </button>
                {isOpen && (
                  <div className="px-6 md:px-7 pb-6 md:pb-7">
                    <p className="text-[16px] md:text-[17px] leading-[1.6] text-fg-2 max-w-[680px]">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-line px-5 md:px-8 py-10">
      <div className="max-w-container mx-auto flex flex-col md:flex-row items-center gap-5">
        <Logo size={15} />
        <div className="text-fg-3 text-[13px] md:ml-auto">© 2026 Ship 30 for 30, LLC.</div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════
   STICKY CTA BAR — appears when hero CTA scrolls off
   ═══════════════════════════════════════════════════════════ */
function StickyCtaBar({ heroCtaRef }: { heroCtaRef: React.RefObject<HTMLAnchorElement | null> }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = heroCtaRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { threshold: 0 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [heroCtaRef])
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 border-b border-line backdrop-blur-md transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ background: 'rgba(11,11,12,0.85)' }}
    >
      <div className="max-w-container mx-auto px-5 h-[64px] flex items-center justify-between gap-4">
        <Logo size={14} className="hidden md:flex" />
        <div className="hidden md:block">
          <CountdownTimer targetDate={CART_CLOSE_DATE} compact />
        </div>
        <CTA size="sm" track="Sticky Bar" className="mx-auto md:mx-0">Join The Sprint</CTA>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const heroCtaRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const thresholds = [25, 50, 75, 100]
    const firedScroll = new Set<number>()
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      const pct = (window.scrollY / total) * 100
      for (const t of thresholds) {
        if (pct >= t && !firedScroll.has(t)) {
          firedScroll.add(t)
          Fathom.trackEvent(`Scroll: ${t}%`)
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className="min-h-screen bg-ink">
      <Hero ctaRef={heroCtaRef} />
      <FadeIn><WhyNewsletter /></FadeIn>
      <FadeIn><WhatIsTheSprint /></FadeIn>
      <FadeIn><Instructors /></FadeIn>
      <FadeIn><NewsletterProof /></FadeIn>
      <FadeIn><RightForYou /></FadeIn>
      <Divider />
      <FadeIn><LiveSessions /></FadeIn>
      <FadeIn><BonusSection /></FadeIn>
      <FadeIn><AIWritingSkool /></FadeIn>
      <FadeIn><Pricing /></FadeIn>
      <FadeIn><CTABand /></FadeIn>
      <FadeIn><FAQ /></FadeIn>
      <Footer />
      <StickyCtaBar heroCtaRef={heroCtaRef} />
    </main>
  )
}
