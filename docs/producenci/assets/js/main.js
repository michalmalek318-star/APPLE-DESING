/* HAZEO — skrypty strony */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- rok w stopce ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- nawigacja mobilna ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* ---------- opowieść przewijana ---------- */
  var story = document.getElementById('story');
  var stage = document.getElementById('stage');
  var header = document.getElementById('header');

  if (story && stage) {
    var copies = stage.querySelectorAll('.scene-copy');
    var images = stage.querySelectorAll('.scene-img');
    var dots = stage.querySelectorAll('.stage-progress button');
    var tag = document.getElementById('stageTag');
    var heroLit = stage.querySelector('.hero-lit');
    var video = stage.querySelector('.hero-video');
    var total = copies.length;
    var splitsDesktop = ['47%', '38%', '50%', '40%', '46%'];
    var splitsMobile = ['36%', '40%', '42%', '42%', '44%'];
    var tags = ['Gdańsk, zmierzch', 'Rynek: sieci i importerzy', 'Kupcy: rozmowa z decydentami', 'Tarcza: domena i NIS2', 'Spotkania w kalendarzu'];
    var current = 0;
    var ticking = false;

    /* Wideo przejmuje scenę 1 dopiero, gdy naprawdę da się je odtworzyć. Brak kodeka,
       nieudane pobranie albo tryb ograniczonej animacji zostawiają przenikanie na zdjęciach,
       zamiast zatrzymać hero na wygaszonym kadrze. */
    if (video && video.dataset.src && !reduceMotion) {
      video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
      video.addEventListener('loadeddata', function () {
        video.hidden = false;
        if (heroLit) heroLit.style.display = 'none';
      }, { once: true });
      video.src = video.dataset.src;
    }

    var setScene = function (n) {
      if (n === current) return;
      current = n;
      copies.forEach(function (c) { c.classList.toggle('is-active', +c.dataset.scene === n); });
      images.forEach(function (img) { img.classList.toggle('is-active', +img.dataset.scene === n); });
      dots.forEach(function (d) {
        var active = +d.dataset.go === n;
        d.classList.toggle('is-active', active);
        if (active) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      });
      stage.style.setProperty('--split', splitsDesktop[n - 1]);
      stage.style.setProperty('--split-m', splitsMobile[n - 1]);
      if (tag) tag.textContent = tags[n - 1];
    };

    var update = function () {
      ticking = false;
      var rect = story.getBoundingClientRect();
      var range = rect.height - window.innerHeight;
      var p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      var n = Math.min(total, Math.floor(p * total) + 1);
      setScene(n);

      /* scena 1: rozświetlenie kadru albo przewijanie wideo */
      var inFirst = Math.min(1, p * total);
      if (heroLit) heroLit.style.setProperty('--lit', reduceMotion ? 1 : Math.min(1, inFirst * 1.4).toFixed(3));
      if (video && video.src && video.duration) video.currentTime = inFirst * video.duration;

      if (header) header.classList.toggle('is-solid', rect.bottom <= 80);
    };

    var onScroll = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        var n = +d.dataset.go;
        var top = story.getBoundingClientRect().top + window.pageYOffset;
        var range = story.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + range * ((n - 1) / total) + range / total * 0.35, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    current = 0; setScene(1); update();
  } else if (header) {
    header.classList.add('is-solid');
  }

  /* ---------- pojawianie się sekcji ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- wybór usługi z przycisków oferty ---------- */
  var interest = document.getElementById('f-interest');
  document.querySelectorAll('[data-interest]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (interest) interest.value = btn.dataset.interest;
    });
  });

  /* ---------- formularz kontaktowy ---------- */
  var form = document.getElementById('contactForm');
  if (!form) return;
  var status = document.getElementById('formStatus');
  var submit = document.getElementById('submitBtn');

  var rules = {
    name: function (v) { return v.trim().length >= 2 || 'Podaj imię i nazwisko.'; },
    company: function (v) { return v.trim().length >= 2 || 'Podaj nazwę firmy.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Podaj poprawny adres e-mail.'; },
    message: function (v) { return v.trim().length >= 10 || 'Napisz kilka słów o produktach i rynkach.'; }
  };

  var showError = function (name, msg) {
    var input = form.elements[name];
    var slot = document.getElementById('e-' + name);
    if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (slot) slot.textContent = msg || '';
    if (input && slot) input.setAttribute('aria-describedby', 'e-' + name);
  };

  var validate = function () {
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      var res = rules[name](form.elements[name].value);
      showError(name, res === true ? '' : res);
      if (res !== true && !firstBad) firstBad = form.elements[name];
    });
    var consent = form.elements.consent;
    var cSlot = document.getElementById('e-consent');
    if (!consent.checked) {
      if (cSlot) cSlot.textContent = 'Zaznacz zgodę, żebyśmy mogli odpowiedzieć.';
      if (!firstBad) firstBad = consent;
    } else if (cSlot) { cSlot.textContent = ''; }
    return firstBad;
  };

  Object.keys(rules).forEach(function (name) {
    form.elements[name].addEventListener('blur', function () {
      var res = rules[name](this.value);
      showError(name, res === true ? '' : res);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';
    var bad = validate();
    if (bad) { bad.focus(); return; }

    submit.disabled = true;
    submit.textContent = 'Wysyłanie…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'fetch' }
    })
      .then(function (res) { return res.json().catch(function () { return { ok: false }; }).then(function (data) { return { res: res, data: data }; }); })
      .then(function (r) {
        if (r.res.ok && (r.data.ok || String(r.data.success) === 'true')) {
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Dziękujemy. Odpowiemy w ciągu jednego dnia roboczego.';
        } else {
          throw new Error((r.data && (r.data.error || r.data.message)) || 'send');
        }
      })
      .catch(function (err) {
        status.className = 'form-status err';
        status.textContent = err && err.message && err.message !== 'send' && err.message !== 'Failed to fetch'
          ? err.message
          : 'Nie udało się wysłać. Napisz bezpośrednio na michalmalek@hazeo.pl.';
      })
      .finally(function () {
        submit.disabled = false;
        submit.textContent = 'Wyślij zapytanie';
      });
  });
})();
