import { useEffect, useRef, useState } from 'react'
import './App.css'

/* ── data ─────────────────────────────────────────────── */
const topics = [
  {
    id: '01', label: 'Co to jest AI?',
    desc: 'Fundament wiedzy — od historii do współczesności.',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=90',
  },
  {
    id: '02', label: 'Bankowość & Cyberbezpieczeństwo',
    desc: 'Jak AI chroni i transformuje sektor finansowy.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=90',
  },
  {
    id: '03', label: 'AI w Edukacji',
    desc: 'Personalizacja nauki i przyszłość szkół.',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=90',
  },
  {
    id: '04', label: 'AI w Biznesie',
    desc: 'Automatyzacja, dane i przewaga konkurencyjna.',
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&q=90',
  },
  {
    id: '05', label: 'AI w Kosmosie i Nauce',
    desc: 'Odkrywanie wszechświata z pomocą algorytmów.',
    img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=900&q=90',
  },
  {
    id: '06', label: 'AI w Kulturze i Mediach',
    desc: 'Kreatywność, generatywne media i sztuka.',
    img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&q=90',
  },
  {
    id: '07', label: 'AI w Medycynie',
    desc: 'Diagnostyka, genomika i leki przyszłości.',
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=900&q=90',
  },
]

const whyItems = [
  {
    num: '01',
    title: 'Innowacyjne podejście',
    desc: 'Żadnych nudnych prezentacji. Każdy panel to żywa dyskusja z ekspertami — praktyczna, prowokująca, niezapomniana.',
  },
  {
    num: '02',
    title: 'Networking na szczycie',
    desc: 'Dołącz do liderów, startupowców i wizjonerów. Konferencja w wyjątkowej górskiej scenerii tworzy przestrzeń do prawdziwych rozmów.',
  },
  {
    num: '03',
    title: 'Wsparcie młodych',
    desc: 'Budujemy pokolenie, które rozumie AI. Specjalna strefa dla studentów i młodych profesjonalistów — mentoring, wiedza, kontakty.',
  },
  {
    num: '04',
    title: 'Format, który angażuje',
    desc: 'Siedem tematycznych paneli, każdy z moderatorem i otwartą dyskusją. Mówisz, słuchasz, działasz — nie tylko siedzisz.',
  },
]

const EVENT_DATE = new Date('2026-06-11T09:00:00')

function useCountdown() {
  const [time, setTime] = useState(() => getRemaining())
  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}
function getRemaining() {
  const diff = EVENT_DATE - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}
function pad(n) { return String(n).padStart(2, '0') }

/* ── smooth cursor ─────────────────────────────────────── */
function useSmoothCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: -200, y: -200 })
  const ring    = useRef({ x: -200, y: -200 })

  useEffect(() => {
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.10
      ring.current.y += (mouse.current.y - ring.current.y) * 0.10
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px,${mouse.current.y - 4}px)`
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x - 22}px,${ring.current.y - 22}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return { dotRef, ringRef, mouse }
}

/* ── parallax ──────────────────────────────────────────── */
function useParallax() {
  const [p, setP] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const fn = (e) => setP({
      x: (e.clientX / window.innerWidth  - 0.5) * 28,
      y: (e.clientY / window.innerHeight - 0.5) * 18,
    })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])
  return p
}

/* ── scroll reveal ─────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed') }),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

/* ── component ─────────────────────────────────────────── */
export default function App() {
  const [hovered, setHovered] = useState(null)
  const [previewXY, setPreviewXY] = useState({ x: -400, y: -400 })
  const { dotRef, ringRef, mouse } = useSmoothCursor()
  const p = useParallax()
  const countdown = useCountdown()
  useReveal()

  useEffect(() => {
    const fn = (e) => setPreviewXY({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <div className="shell">
      {/* cursor */}
      <div ref={dotRef}  className="cur-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cur-ring" aria-hidden="true" />

      {/* bg */}
      <div className="hero-bg" style={{ transform: `translate(${p.x * 0.45}px,${p.y * 0.45}px) scale(1.07)` }} aria-hidden="true" />
      <div className="hero-overlay" aria-hidden="true" />

      {/* orbs */}
      <div className="orb orb-1" style={{ transform: `translate(${p.x * 1.6}px,${p.y * 1.3}px)` }} aria-hidden="true" />
      <div className="orb orb-2" style={{ transform: `translate(${-p.x}px,${-p.y * 0.9}px)` }}    aria-hidden="true" />

      {/* topic hover preview */}
      <div
        className={`topic-preview${hovered !== null ? ' visible' : ''}`}
        style={{
          backgroundImage: hovered !== null ? `url(${topics[hovered].img})` : 'none',
          transform: `translate(${previewXY.x + 40}px,${previewXY.y - 120}px) rotate(-2deg)`,
        }}
        aria-hidden="true"
      />

      {/* ══ HERO ══ */}
      <section className="hero">
        <p className="eyebrow" data-reveal>Erste Bank presents</p>

        <h1 className="title" data-reveal>
          AI Beyond<br />Intelligence
        </h1>

        <p className="location-tag" data-reveal>
          <span className="loc-icon">▲</span>
          Konferencja na górze · Warszawa · 11 czerwca 2026
        </p>

        <div className="countdown" data-reveal>
          {[['dni', countdown.d], ['godz', countdown.h], ['min', countdown.m], ['sek', countdown.s]].map(([lbl, val]) => (
            <div key={lbl} className="cd-cell">
              <span className="cd-val">{pad(val)}</span>
              <span className="cd-lbl">{lbl}</span>
            </div>
          ))}
        </div>

        <div className="hero-actions" data-reveal>
          <a className="cta cta-primary" href="https://example.com/rejestracja" target="_blank" rel="noopener noreferrer">
            Zarejestruj się
          </a>
          <a className="cta cta-ghost" href="#program">Zobacz program</a>
        </div>
      </section>

      {/* ══ PROGRAM ══ */}
      <section className="section" id="program">
        <p className="section-label" data-reveal>Program</p>
        <h2 className="section-title" data-reveal>7 paneli. Jedna wizja.</h2>

        <ul className="topics" data-reveal>
          {topics.map((t, i) => (
            <li
              key={t.id}
              style={{ '--i': i }}
              className={hovered !== null && hovered !== i ? 'dim' : ''}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="num">{t.id}</span>
              <div className="topic-body">
                <span className="topic-name">{t.label}</span>
                <span className="topic-desc">{t.desc}</span>
              </div>
              <span className="arrow">→</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ PHOTO STRIP ══ */}
      <div className="photo-strip" aria-hidden="true">
        {topics.map((t) => (
          <div key={t.id} className="strip-img" style={{ backgroundImage: `url(${t.img})` }} />
        ))}
      </div>

      {/* ══ WHY ══ */}
      <section className="section section-why" id="dlaczego">
        <p className="section-label" data-reveal>Dlaczego warto</p>
        <h2 className="section-title" data-reveal>Zaprojektowane<br />inaczej.</h2>

        <div className="why-grid">
          {whyItems.map((w, i) => (
            <div className="why-card" key={w.num} data-reveal style={{ '--wi': i }}>
              <span className="why-num">{w.num}</span>
              <h3 className="why-title">{w.title}</h3>
              <p className="why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ REGISTER CTA BAND ══ */}
      <section className="cta-band" id="rejestracja" data-reveal>
        <div className="cta-band-inner">
          <p className="cta-band-label">Dołącz do nas</p>
          <h2 className="cta-band-title">Liczba miejsc jest ograniczona.</h2>
          <a
            className="cta cta-primary cta-large"
            href="https://example.com/rejestracja"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zarejestruj się →
          </a>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <span>AI Beyond Intelligence · Warszawa · 2026</span>
        <span>aibi2026.pl</span>
      </footer>
    </div>
  )
}
