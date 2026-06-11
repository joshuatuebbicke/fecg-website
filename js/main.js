/* ============================================================
   FECG Ratzeburg – JavaScript v3
   ============================================================ */

/* ------------------------------------------------------------
   Footer Akkordeon (Mobile)
   ------------------------------------------------------------ */
(function () {
  document.querySelectorAll('.footer__nav-heading').forEach(function (heading) {
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');
    heading.addEventListener('click', function () {
      var col = heading.closest('.footer__nav-col');
      col.classList.toggle('footer__nav-col--open');
    });
    heading.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        heading.click();
      }
    });
  });
})();

/* ------------------------------------------------------------
   Navigation
   ------------------------------------------------------------ */
(function () {
  const nav    = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.nav__mobile');
  const hasHero = document.querySelector('.hero, .page-hero');

  // Seiten ohne Hero: Nav sofort dunkel
  if (!hasHero) nav?.classList.add('nav--solid');

  // Hamburger öffnen / schließen
  burger?.addEventListener('click', function () {
    const open = mobile?.classList.toggle('nav__mobile--open');
    burger.classList.toggle('nav__burger--open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Schließen bei Link-Klick
  mobile?.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobile.classList.remove('nav__mobile--open');
      burger?.classList.remove('nav__burger--open');
      document.body.style.overflow = '';
      burger?.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ------------------------------------------------------------
   Hero Slideshow
   ------------------------------------------------------------ */
(function () {
  const slides    = document.querySelectorAll('.hero__slide');
  const dots      = document.querySelectorAll('.hero__dot');
  const statement = document.getElementById('heroStatement');
  const pauseBtn  = document.querySelector('.hero__pause');

  if (!slides.length || !statement) return;

  const statements = [
    'Hier darfst du sein, wer du bist.',
    'Gemeinsam glauben leben.',
    'Jeden Sonntag. Ratzeburg.'
  ];

  let current = 0;
  let paused  = false;
  let timer;

  function goTo(idx) {
    // Folie wechseln
    slides[current].classList.remove('hero__slide--active');
    dots[current].classList.remove('hero__dot--active');
    dots[current].setAttribute('aria-selected', 'false');

    // Statement ausblenden, Text wechseln, einblenden
    statement.classList.remove('hero__statement--visible');
    current = idx;

    slides[current].classList.add('hero__slide--active');
    dots[current].classList.add('hero__dot--active');
    dots[current].setAttribute('aria-selected', 'true');

    setTimeout(function () {
      statement.textContent = statements[current];
      statement.classList.add('hero__statement--visible');
    }, 320);
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5200);
  }

  // Initialisieren
  const heroCta = document.querySelector('.hero__cta');
  statement.textContent = statements[0];
  statement.classList.add('hero__statement--visible');
  if (heroCta) heroCta.classList.add('hero__cta--visible');
  startTimer();

  // Dot-Klicks
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goTo(i);
      if (!paused) startTimer();
    });
  });

  // Pause / Play
  pauseBtn?.addEventListener('click', function () {
    paused = !paused;
    if (paused) {
      clearInterval(timer);
      pauseBtn.textContent = 'Play';
      pauseBtn.setAttribute('aria-pressed', 'true');
    } else {
      startTimer();
      pauseBtn.textContent = 'Pause';
      pauseBtn.setAttribute('aria-pressed', 'false');
    }
  });

  // Touch-Swipe für Mobile
  let touchX = 0;
  const hero = document.querySelector('.hero');
  hero?.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].screenX;
  }, { passive: true });
  hero?.addEventListener('touchend', function (e) {
    const diff = touchX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length);
      if (!paused) startTimer();
    }
  }, { passive: true });
})();

/* ------------------------------------------------------------
   Scroll-Reveal: .reveal-Elemente einblenden
   ------------------------------------------------------------ */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('reveal--visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

  els.forEach(function (el) { io.observe(el); });

  // Fallback: Elemente die bereits im Viewport sichtbar sind sofort einblenden
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.reveal--visible)').forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('reveal--visible');
      }
    });
  }, 100);
})();

/* ------------------------------------------------------------
   Smooth-Scroll für Anker-Links
   ------------------------------------------------------------ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + scrollY - navH,
        behavior: 'smooth'
      });
    });
  });
})();

/* ------------------------------------------------------------
   Kontaktformular – Client-seitige Validierung
   ------------------------------------------------------------ */
(function () {
  const form = document.querySelector('form[action*="formspree"]');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    let ok = true;

    form.querySelectorAll('[required]').forEach(function (f) {
      if (!f.value.trim()) {
        ok = false;
        f.style.borderColor = '#c0392b';
      } else {
        f.style.borderColor = '';
      }
    });

    const email = form.querySelector('[type="email"]');
    if (email?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      ok = false;
      email.style.borderColor = '#c0392b';
    }

    if (!ok) e.preventDefault();
  });

  form.querySelectorAll('input, textarea').forEach(function (f) {
    f.addEventListener('input', function () { f.style.borderColor = ''; });
  });
})();

/* ------------------------------------------------------------
   Nächster Sonntag — dynamisches Datum in Sunday CTA
   ------------------------------------------------------------ */
(function () {
  const el = document.getElementById('nextSundayDate');
  if (!el) return;

  const today = new Date();
  const day   = today.getDay(); // 0 = Sonntag
  const diff  = day === 0 ? 0 : 7 - day; // 0 wenn heute Sonntag
  const next  = new Date(today);
  next.setDate(today.getDate() + diff);

  const formatted = next.toLocaleDateString('de-DE', {
    day:   'numeric',
    month: 'long'
  });

  el.textContent = formatted;


})();

/* ------------------------------------------------------------
   Google Calendar — Nächste Termine (fetch, kein iFrame)
   ------------------------------------------------------------ */
(function () {
  // ── Hier Calendar ID und API Key eintragen ──────────────────
  const CALENDAR_ID = 'DEINE-KALENDER-ID@group.calendar.google.com';
  const API_KEY     = 'DEIN-GOOGLE-API-KEY';
  const MAX_RESULTS = 5;
  // ─────────────────────────────────────────────────────────────

  const container = document.getElementById('gcalEvents');
  if (!container) return;

  // Placeholder-Werte → still bleiben
  if (CALENDAR_ID.startsWith('DEINE') || API_KEY.startsWith('DEIN')) {
    // Platzhalter-Termine bis Kalender eingerichtet ist
    container.innerHTML = [
      { badge: 'So, 8. Jun',  title: 'Gottesdienst',                  time: '10:00 Uhr · Robert-Bosch-Str. 7' },
      { badge: 'Fr, 13. Jun', title: 'Jugend Time-Out',               time: '18:45 Uhr' },
      { badge: 'So, 15. Jun', title: 'Gottesdienst + Gemeinschaftstreffen', time: '10:00 Uhr' },
      { badge: 'Fr, 20. Jun', title: 'Royal Rangers',                 time: '17:00 Uhr' },
    ].map(function(ev) {
      return `<div class="event-item">
        <span class="event-item__badge">${ev.badge}</span>
        <div class="event-item__info">
          <p class="event-item__title">${ev.title}</p>
          <p class="event-item__time">${ev.time}</p>
        </div>
      </div>`;
    }).join('');
    return;
  }

  const timeMin = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`
    + `?key=${API_KEY}&timeMin=${timeMin}&maxResults=${MAX_RESULTS}&singleEvents=true&orderBy=startTime`;

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.items || data.items.length === 0) {
        container.innerHTML = '<p class="event-item__error">Keine bevorstehenden Termine gefunden.</p>';
        return;
      }
      container.innerHTML = data.items.map(function (ev) {
        const start   = ev.start.dateTime || ev.start.date;
        const date    = new Date(start);
        const day     = date.toLocaleDateString('de-DE', { day: 'numeric' });
        const month   = date.toLocaleDateString('de-DE', { month: 'short' });
        const hasTime = !!ev.start.dateTime;
        const time    = hasTime
          ? date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'
          : 'Ganztägig';
        const badge = date.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
        const loc = ev.location ? ' · ' + ev.location.split(',')[0] : '';
        return `<div class="event-item">
          <span class="event-item__badge">${badge}</span>
          <div class="event-item__info">
            <p class="event-item__title">${ev.summary || 'Termin'}</p>
            <p class="event-item__time">${time}${loc}</p>
          </div>
        </div>`;
      }).join('');
    })
    .catch(function () {
      container.innerHTML = '<p class="event-item__error">Termine konnten nicht geladen werden.</p>';
    });
})();
